import { BehaviorSubject } from 'rxjs';

export class StakingServiceMock {
    public connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    public updated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    getContractForLP(lp: string) {}

    async totalSupply() {}

    async balanceOf() {}

    async stake() {}

    async withdraw() {}

    async exit() {}

    async getReward() {}

    async earned() {
        return {};
    }
}
