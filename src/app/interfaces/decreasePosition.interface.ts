import { ethers } from 'ethers';
import {
    IPositionAction,
    IPositionActionWithLoop,
} from './positionAction.interface';

export interface IDecreaseSimplePosition extends IPositionAction {
    withdrawAmount: ethers.BigNumber;
    maxSupplyTokenRepayAmount: ethers.BigNumber;
    borrowTokenRepayAmount: ethers.BigNumber;
    supplyTokenRepayAmount?: ethers.BigNumber;
}

export interface IDecreaseSimplePositionWithLoop
    extends IPositionActionWithLoop {
    repayAmount?: ethers.BigNumber;
    withdrawAmount: ethers.BigNumber;
    maxRedeemAmount: ethers.BigNumber;
    minRepayAmount: ethers.BigNumber;
    exchangeData: string;
}
