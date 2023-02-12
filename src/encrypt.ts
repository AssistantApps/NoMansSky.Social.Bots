import "reflect-metadata";

import { quickSilverCompanionMentionHandler } from "./features/quickSilverCompanion/quickSilverCompanion";
import { decrypt, encrypt } from "./helper/cryptoHelper";
import { getConfig } from "./services/internal/configService";
import { getLog } from "./services/internal/logService";

const fs = require('fs');
require('dotenv').config();

const main = async () => {
    const encryptionKey = getConfig().getEncryptionKey();

    try {
        const content = fs.readFileSync('./src/assets/data/credentials.json', 'utf8');
        const encContent = encrypt(encryptionKey, content);
        fs.writeFileSync('./src/assets/data/credentials.enc.json', encContent);

        getLog().i('Successfully wrote encryped credentials json');
    } catch (err) {
        getLog().e('Failed to write encryped credentials json');
        getLog().e(err);
    }
}

main();