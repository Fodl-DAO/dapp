import { ethers } from 'ethers';

export const sumBigNumbers = (list: ethers.BigNumber[]) =>
    list.reduce((a, c) => a.add(c), ethers.BigNumber.from(0));
