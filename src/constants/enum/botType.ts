export enum BotType {
    unknown = 'unknown',
    ariadne = 'ariadne',
    ariadne1 = 'ariadne1',
    qsCompanion = 'qsCompanion',
}

export const allBotTypes = () => Object.keys(BotType);