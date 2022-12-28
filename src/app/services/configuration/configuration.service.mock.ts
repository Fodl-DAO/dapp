import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IConfig } from '../../interfaces/config.interface';

export class ConfigurationServiceMock {
    basicConfig: IConfig = {
        build: '',
        exchangeSlippage: 1,
        foldingRegistry: '',
        lendingPlatformLens: '',
        simplePositionLens: '',
        rewardsDistributor: '',
        fodlStakingUsdc: '',
        fodlStakingEth: '',
        fodlStakingWmatic: '',
        singleSidedStaking: '',
        xFodlUpdate: '',
        bscFoldingRegistry: '',
        bscLendingPlatformLens: '',
        bscSimplePositionLens: '',
        bscRewardsDistributor: '',
        polygonFoldingRegistry: '',
        polygonLendingPlatformLens: '',
        polygonSimplePositionLens: '',
        polygonRewardsDistributor: '',
        network: '',
        chainId: '',
        rpcUrl: '',
        bscChainId: '',
        bscRpcUrl: '',
        polygonChainId: '',
        polygonRpcUrl: '',
        sltp: false,
        stopLoss: true,
        cacheExpiresSeconds: 1,
    };

    config: IConfig = this.basicConfig;

    configSubject$ = new BehaviorSubject<IConfig>(this.config);
    config$: Observable<IConfig> = this.configSubject$.asObservable();

    reload() {
        return {};
    }

    getConfig(): IConfig {
        return this.config;
    }

    getValueObservable<K extends keyof IConfig>(
        key: K,
    ): Observable<IConfig[K]> {
        return this.config$.pipe(map((config) => config[key]));
    }

    getValue<F extends keyof IConfig>(key: F): IConfig[F] {
        return this.config[key];
    }
}
