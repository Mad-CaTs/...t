import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricalComponent, ValidatorComponent } from './pages';
import { AuthGuard } from '@app/core/guards/auth';


const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/exoneration/validator' },
	{ path: 'validator', component: ValidatorComponent },
	{ path: 'historical', component: HistoricalComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExonerationRoutingModule { }
