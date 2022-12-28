import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RewardsComponent } from './rewards.component';

const routes: Routes = [
    {
        path: '',
        component: RewardsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RewardsRoutesModule {}
