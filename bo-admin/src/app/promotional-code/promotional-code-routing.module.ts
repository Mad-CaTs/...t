import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth';
import { RequestPromotionalCodeComponent } from './pages/request/request-promotional-code.component';


const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/promotional-code/request' },
	{ path: 'request', component: RequestPromotionalCodeComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PromotionalCodeRoutingModule { }
