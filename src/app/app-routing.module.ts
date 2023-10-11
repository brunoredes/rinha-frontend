import { NgModule } from "@angular/core";
import { NgModel } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    // { path: 'home', loadComponent: () => HomeComponent, title: titles.home },
    // { path: 'lineup', loadComponent: () => LineupComponent, title: titles.lineUp },
    // { path: '**', loadComponent: () => NotFoundComponentComponent, title: titles.notFound }
];
@NgModule({
    imports: [RouterModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }