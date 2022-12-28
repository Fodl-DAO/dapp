import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditLeverageComponent } from './edit-leverage.component';

const routes: Routes = [
    {
        path: '',
        component: EditLeverageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EditLeverageRoutesModule {}
