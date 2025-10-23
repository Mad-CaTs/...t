import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrequentlyAskedQuestionsComponent, TutorialComponent } from './pages';
import { FormQuestionComponent } from './pages/frequently-asked-questions/form-question/form-question.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/tools/tutorial-manager' },
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/tools/frequently-asked-questions' },
	{ path: 'tutorial-manager', component: TutorialComponent },
	{ path: 'frequently-asked-questions', component: FrequentlyAskedQuestionsComponent },
	{ path: 'frequently-asked-questions/new', component: FormQuestionComponent },
	{ path: 'frequently-asked-questions/edit/:id', component: FormQuestionComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ToolsRoutingModule {}
