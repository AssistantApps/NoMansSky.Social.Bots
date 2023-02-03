import credentialsJson from './assets/data/credentials.json';
import { MastodonClientMeta } from './contracts/mastoClientMeta';
import { onErrorHandler } from './handler/errorHandler';
import { onMessageHandler } from './handler/messageHandler';

require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');

console.log("Starting up bot accounts");

const mastoClients: Array<MastodonClientMeta> = [];
for (const cred of credentialsJson.accounts) {
    mastoClients.push({
        name: cred.name,
        client: new Mastodon({
            client_key: cred.clientKey,
            client_secret: cred.clientSecret,
            access_token: cred.accessToken,
            timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
            api_url: process.env.API_URL,
        }),
        listener: null,
    });
    console.log(`\t${cred.name} client ✔`);
}

for (const mastoClient of mastoClients) {
    const listener: any = mastoClient.client.stream('streaming/user');
    listener.on('error', onErrorHandler(mastoClient));
    listener.on('message', onMessageHandler(mastoClient));
    mastoClient.listener = listener;
}


console.log("Setup complete...");