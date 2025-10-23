import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ToolsRoutingModule } from './tools-routing.module';
import { QuestionFormComponent } from './components/question-form/question-form.component';

@NgModule({
	declarations: [],
	imports: [CommonModule, ToolsRoutingModule],
	providers: [CurrencyPipe]
})
export class ToolsModule {}
