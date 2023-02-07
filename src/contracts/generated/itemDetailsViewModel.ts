
export interface ItemDetailsViewModel {
    appId: string;
    link: string;
    baseLink: string;
    name: string;
    group: string;
    icon: string;
    iconUrl: string;
    description: string;
    baseValueUnits: number;
    currencyType: string;
    maxStackSize: number;
    colour: string;
    usages: Array<string>;
    blueprintCost: number;
    blueprintCostType: string;
    blueprintSource: string;
    requiredItems: Array<RequiredItemViewModel>;
    consumableRewardTexts: Array<string>;
}

export interface RequiredItemViewModel {
    appId: string;
    link: string;
    baseLink: string;
    quantity: number;
}