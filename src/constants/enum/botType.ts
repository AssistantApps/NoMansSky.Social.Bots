export enum BotType {
    unknown = 'unknown',
    admin = 'admin',
    ariadne = 'ariadne',
    theRealAriadne = 'theRealAriadne',
    qsCompanion = 'qsCompanion',
    nada = 'nada',
    dev = 'dev',
    assistantnmstracker = 'assistantnmstracker',
}

export const allBotTypes = () => Object.keys(BotType).filter(bt => bt != BotType.unknown);
export const sidebarBotTypes = () => allBotTypes();

export const dontSetupListenersBotTypes = () => [
    BotType.unknown,
    BotType.admin,
    BotType.assistantnmstracker,
    BotType.dev,
].map(bt => bt.toString());

export const botsThatUseRandomDialog = () => [
    BotType.ariadne,
    BotType.theRealAriadne,
];
