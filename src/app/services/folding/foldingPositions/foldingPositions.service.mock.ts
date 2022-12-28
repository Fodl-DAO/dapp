import { IPosition } from '../../../interfaces/position.interface';

export class FoldingPositionsServiceMock {
    async getPositions(accounts: string[]): Promise<IPosition[]> {
        return [];
    }
}
