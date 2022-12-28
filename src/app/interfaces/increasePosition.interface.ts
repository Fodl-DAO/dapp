import { ethers } from 'ethers';

import {
    IPositionAction,
    IPositionActionWithLoop,
} from './positionAction.interface';

export interface IIncreaseSimplePosition extends IPositionAction {
    principalAmount: ethers.BigNumber;
    supplyAmount: ethers.BigNumber;
    borrowAmount?: ethers.BigNumber;
    maxBorrowAmount: ethers.BigNumber;
}

export interface IIncreaseSimplePositionWithLoop
    extends IPositionActionWithLoop {
    supplyAmount?: ethers.BigNumber;
    principalAmount: ethers.BigNumber;
    minSupplyAmount: ethers.BigNumber;
    totalBorrowAmount: ethers.BigNumber;
    exchangeData: string;
}
