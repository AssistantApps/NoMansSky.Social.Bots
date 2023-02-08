import { existsSync, mkdirSync, readdir, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { getAssistantNmsApi } from "../services/api/assistantNmsApiService";

import { getBotPath } from "../services/internal/configService";

const svg2img = require('svg2img');

export const getCachedUniqueName = () => (new Date()).getTime() / (5 * 60000); // new value every 5min

export const removeOldImageFiles = () => {
    const uniqueNum = getCachedUniqueName();
    const dirname = getBotPath();
    const tempFolder = join(dirname, 'temp');

    readdir(tempFolder, (err, files) => {
        for (const file of files) {
            if (file.includes(uniqueNum.toString())) {
                continue;
            }
            if (file.includes('.png') || file.includes('.svg')) {
                unlinkSync(file);
            }
        }
    });
}

export const getTempFile = (filenamePrefix: string, extension: string): string => {
    const uniqueNum = getCachedUniqueName();
    const filename = `${filenamePrefix}-${Math.round(uniqueNum)}.${extension}`;
    const dirname = getBotPath();
    const tempFolder = join(dirname, 'temp');

    if (existsSync(tempFolder) == false) {
        mkdirSync(tempFolder);
    }

    const outputFilePath = join(tempFolder, filename);
    return outputFilePath;
}

export const getBufferFromSvg = async (filenamePrefix: string, compiledTemplate: string, callback: (outputFilePath: string) => void) => {
    const outputFilePath = getTempFile(filenamePrefix, 'png');

    svg2img(compiledTemplate, (error: any, buffer: any) => {
        writeFileSync(outputFilePath, buffer);
        callback(outputFilePath);
    });
}

export const getBase64FromAssistantNmsImage = async (iconPath: string): Promise<string> => {
    const imageUrl = `https://app.nmsassistant.com/assets/images/${iconPath}`;

    const assistantNmsApi = getAssistantNmsApi();
    const base64 = await assistantNmsApi.getRemoteImageAsBase64(imageUrl);

    return base64;
}

export const getBase64FromFile = (file: string): string => {
    const contents = readFileSync(file, "base64");
    return `data:image/png;base64,${contents}`;
}