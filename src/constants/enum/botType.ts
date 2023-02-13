export enum BotType {
    unknown = 'unknown',
    ariadne = 'ariadne',
    theRealAriadne = 'theRealAriadne',
    qsCompanion = 'qsCompanion',
}

export const allBotTypes = () => Object.keys(BotType).filter(bt => bt != BotType.unknown);


export const botsThatUsRandomDialog = () => [
    BotType.ariadne,
    BotType.theRealAriadne,
]
