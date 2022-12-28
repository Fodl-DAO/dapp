import { Observable } from 'rxjs';

import { BigNumber } from 'ethers';

export interface ITransactionData {
    action: Observable<any>;
    actionDescription?: string;
    approve?: {
        account: string;
        amount: BigNumber;
        decimals: number;
        token: string;
    };
    callback?: Function;
    title: string;
}
