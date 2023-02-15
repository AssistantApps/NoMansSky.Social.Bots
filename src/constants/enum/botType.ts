export enum BotType {
    unknown = 'unknown',
    admin = 'admin',
    ariadne = 'ariadne',
    theRealAriadne = 'theRealAriadne',
    qsCompanion = 'qsCompanion',
}

export const allBotTypes = () => Object.keys(BotType).filter(bt => bt != BotType.unknown);
export const sidebarBotTypes = () => allBotTypes().filter(bt => bt != BotType.admin);


export const botsThatUsRandomDialog = () => [
    BotType.ariadne,
    BotType.theRealAriadne,
]
