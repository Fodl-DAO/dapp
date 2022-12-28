import { ethers } from 'ethers';
import { IPlatform } from './platform.interface';

export interface ITvlPlatformToken {
    supplyToken: string;
    borrowToken: string;
    total: number;
}

export interface ITvlPlatform {
    total: number;
    platform: string;
    tokens: ITvlPlatformToken[];
}

export interface ITvlPositionType {
    borrowTokenAddress: string;
    platformAddress: string;
    positionValue: ethers.BigNumber;
    supplyTokenAddress: string;
    totalValue: ethers.BigNumber;
    safe: boolean;
}

export interface ITvlPositionTypeResponse {
    borrowTokenAddress: string;
    platformAddress: string;
    positionValue: { type: string; hex: string };
    supplyTokenAddress: string;
    totalValue: { type: string; hex: string };
}

export interface ITvlResponse {
    block: number;
    positionTypes: ITvlPositionTypeResponse[];
}

export interface ITvlByPlatform {
    platform: IPlatform;
    total: number;
}
