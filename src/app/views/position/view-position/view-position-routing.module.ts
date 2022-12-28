import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewPositionComponent } from './view-position.component';

const routes: Routes = [
    {
        path: '',
        component: ViewPositionComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewPositionRoutesModule {}
