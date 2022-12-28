import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewPositionComponent } from './new-position.component';

const routes: Routes = [
    {
        path: '',
        component: NewPositionComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewPositionRoutesModule {}
