export enum BotType {
    unknown = 'unknown',
    ariadne = 'ariadne',
    theRealAriadne = 'theRealAriadne',
    qsCompanion = 'qsCompanion',
}

export const allBotTypes = () => Object.keys(BotType);