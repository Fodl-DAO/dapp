import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StakingComponent } from './staking.component';

const routes: Routes = [
    {
        path: '',
        component: StakingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StakingRoutesModule {}
