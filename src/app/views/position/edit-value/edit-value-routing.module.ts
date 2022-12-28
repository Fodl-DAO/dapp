import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditValueComponent } from './edit-value.component';

const routes: Routes = [
    {
        path: '',
        component: EditValueComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EditValueRoutesModule {}
