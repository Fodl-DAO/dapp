export interface ICommonPositionAction {
    platform: string;
    supplyToken: string;
    borrowToken: string;
    account?: string;
    simulate?: boolean;
    executionPrice?: number;
    error?: number;
}

export interface IPositionAction extends ICommonPositionAction {
    path: string;
}

export interface IPositionActionWithLoop extends ICommonPositionAction {
    exchangeData: string;
}
