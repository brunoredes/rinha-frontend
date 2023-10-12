import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./container/home/home.component";
import { ViewerComponent } from "./container/viewer/viewer.component";

const routes: Routes = [
    { path: '', component: HomeComponent, title: "Rinha de FrontEnd - Home" },
    { path: ':fileName', component: ViewerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RinhaRoutingModule { }