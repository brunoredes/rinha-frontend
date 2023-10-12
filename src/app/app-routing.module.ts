import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Rinha de Frontend' },
    { path: 'home', loadChildren: () => import('./rinha/rinha.module').then(module => module.RinhaModule) },
    // { path: 'lineup', loadComponent: () => LineupComponent, title: titles.lineUp },
    // { path: '**', loadComponent: () => NotFoundComponentComponent, title: titles.notFound }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }