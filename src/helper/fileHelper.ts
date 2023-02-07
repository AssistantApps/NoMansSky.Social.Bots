import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getBotPath } from "../services/internal/configService";

const { convertFile } = require('convert-svg-to-png');

export const getStreamFromSvg = async (filenamePrefix: string, compiledTemplate: string) => {
    const uniqueNum = (new Date()).getTime() / (5 * 60000); // new value every 5min
    const filename = `${filenamePrefix}-${Math.round(uniqueNum)}.svg`;
    const dirname = getBotPath();
    const tempFolder = join(dirname, 'temp');

    if (existsSync(tempFolder) == false) {
        mkdirSync(tempFolder);
    }

    const inputFilePath = join(tempFolder, filename);
    if (existsSync(inputFilePath) == false) {
        writeFileSync(inputFilePath, compiledTemplate, {
            flag: 'w',
        });
    }
    const outputFilePath = await convertFile(inputFilePath);
    const fileStream = createReadStream(outputFilePath);
    return fileStream;
}