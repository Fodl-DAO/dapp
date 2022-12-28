import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PositionsComponent } from './positions.component';

const routes: Routes = [
    {
        path: '',
        component: PositionsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PositionsRoutesModule {}
