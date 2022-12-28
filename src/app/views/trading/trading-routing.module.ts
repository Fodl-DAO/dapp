import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TradingComponent } from './trading.component';

const routes: Routes = [
    {
        path: '',
        component: TradingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TradingRoutesModule {}
