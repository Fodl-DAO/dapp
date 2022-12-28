import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./views/root/root.module').then((m) => m.RootModule),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('./views/root/root.module').then((m) => m.RootModule),
    },
    {
        path: 'new-position',
        loadChildren: () =>
            import('./views/position/new-position/new-position.module').then(
                (m) => m.NewPositionModule,
            ),
    },
    {
        path: 'close-position',
        loadChildren: () =>
            import(
                './views/position/close-position/close-position.module'
            ).then((m) => m.ClosePositionModule),
    },
    {
        path: 'edit-leverage',
        loadChildren: () =>
            import('./views/position/edit-leverage/edit-leverage.module').then(
                (m) => m.EditLeverageModule,
            ),
    },
    {
        path: 'edit-value',
        loadChildren: () =>
            import('./views/position/edit-value/edit-value.module').then(
                (m) => m.EditValueModule,
            ),
    },
    {
        path: 'position',
        loadChildren: () =>
            import('./views/position/view-position/view-position.module').then(
                (m) => m.ViewPositionModule,
            ),
    },
    {
        path: 'positions',
        loadChildren: () =>
            import('./views/positions/positions.module').then(
                (m) => m.PositionsModule,
            ),
    },
    {
        path: 'trading',
        loadChildren: () =>
            import('./views/trading/trading.module').then(
                (m) => m.TradingModule,
            ),
    },
    {
        path: 'staking',
        loadChildren: () =>
            import('./views/staking/staking.module').then(
                (m) => m.StakingModule,
            ),
    },
    {
        path: 'rewards',
        loadChildren: () =>
            import('./views/rewards/rewards.module').then(
                (m) => m.RewardsModule,
            ),
    },
    {
        path: '**',
        redirectTo: 'trading',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
