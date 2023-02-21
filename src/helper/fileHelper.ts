import { existsSync, mkdirSync, readdir, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { Resvg } from '@resvg/resvg-js';

import { fontMetas } from "../constants/fonts";
import { getAssistantNmsApi } from "../services/api/assistantNmsApiService";
import { getBotPath, getConfig } from "../services/internal/configService";

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

export const getBufferFromSvg = (compiledTemplate: string): Buffer => {

    const fontFiles = fontMetas.map((fontMeta) => join(getBotPath(), fontMeta.file));
    const opts = {
        fitTo: {
            mode: 'width',
            value: 1200,
        },
        font: {
            fontFiles: fontFiles,
            defaultFontFamily: fontMetas[0].name,
            sansSerifFamily: fontMetas[0].name,
            loadSystemFonts: false, // It will be faster to disable loading system fonts.
        },
    }
    const resvg = new Resvg(compiledTemplate, opts as any)
    const pngData = resvg.render();
    const buffer = pngData.asPng();
    return buffer;
}

export const writePngFromSvg = (
    filenamePrefix: string,
    compiledTemplate: string,
    callback: (outputFilePath: string) => void,
) => {
    const outputFilePath = getTempFile(filenamePrefix, 'png');
    if (getConfig().isProd() == false) {
        const outputFilePathsvg = getTempFile(filenamePrefix, 'svg');
        writeFileSync(outputFilePathsvg, compiledTemplate);
    }

    const buffer = getBufferFromSvg(compiledTemplate);
    writeFileSync(outputFilePath, buffer);
    callback(outputFilePath);
}

export const getBase64FromAssistantNmsImage = async (iconPath: string): Promise<string> => {
    const imageUrl = `https://app.nmsassistant.com/assets/images/${iconPath}`;

    const assistantNmsApi = getAssistantNmsApi();
    const base64 = await assistantNmsApi.getRemoteImageAsBase64(imageUrl);

    return base64;
}

export const getBase64FromFile = (file: string, base64DataType: string = 'image/png'): string => {
    const contents = readFileSync(file, "base64");
    return `data:${base64DataType};base64,${contents}`;
}