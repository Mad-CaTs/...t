import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { handleHttpError } from '@shared/utils/handle-http-error.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { PREGUNTAS_MOCK, StepsNavigation } from '../commons/mocks/mock';
import { AccordionModule } from 'primeng/accordion';
import { FaqService } from '../../commons/services/faq-service';
import {
	FrequentlyAskedQuestion,
	FrequentlyAskedQuestionRequest
} from '../../commons/interfaces/faq.interface';
import { ModalFaqComponent } from '../../commons/modals/modal-faq/modal-faq.component';
import { SearchSelectComponent } from '@shared/components/form-control/search-select/search-select.component';

@Component({
	selector: 'app-faq-section',
	standalone: true,
	imports: [CommonModule, AccordionModule, FormsModule, ModalFaqComponent, SearchSelectComponent],
	templateUrl: './faq-section.component.html',
	styleUrl: './faq-section.component.scss'
})
export default class FaqSectionComponent {
	public currentStep = 2;
	preguntas = PREGUNTAS_MOCK;

	loading: boolean = true;
	questions: FrequentlyAskedQuestion[] = [];
	questionData: FrequentlyAskedQuestionRequest | null = null;
	suggestedQuestion: string = '';
	showModal: boolean = false;
	showModalError: boolean = false;
	notifyTitle: string = '';
	notifyMessage: string = '';
	notifyType: string = '';
	searchTerm: string = '';
	selectedQuestion: any = null;

	constructor(private location: Location, private faqService: FaqService, private cd: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.cd.detectChanges();
		this.loadQuestions();
	}

	onChangeStep(newStep: number) {
		this.currentStep = newStep;
		if (newStep === 1) {
			this.location.back();
		}
	}
	trackById(index: number, item: any): number {
		return item.id;
	}

	selectQuestion(question: any) {
		this.selectedQuestion = question;
		this.cd.detectChanges();
	}

	get stepNavigation() {
		return StepsNavigation;
	}

	getCardKey() {
		return this.selectedQuestion ? this.selectedQuestion.id : null;
	}
	onSearch(term: string) {
		this.searchTerm = term || '';
	}

	filteredQuestions() {
		if (!this.searchTerm || this.searchTerm.trim().length < 2) {
			return this.questions;
		}
		return this.questions.filter((q) => q.question.toLowerCase().includes(this.searchTerm.toLowerCase()));
	}

	sendSuggestedQuestion() {
		if (!this.suggestedQuestion || this.suggestedQuestion.trim().length < 20) {
			this.notifyTitle = 'Error';
			this.notifyMessage = 'Por favor, escriba una pregunta válida (mínimo 20 caracteres).';
			this.notifyType = 'error';
			this.showModalError = true;
			return;
		}

		const userInfo = localStorage.getItem('user_info');
		let fullName = '';

		if (userInfo) {
			const user = JSON.parse(userInfo);
			fullName = `${user.name} ${user.lastName}`;
		}

		this.questionData = {
			usermember: fullName,
			question: this.suggestedQuestion,
			description: '',
			suggested: true,
			imageurl: '',
			imageFile: null
		};

		this.faqService.createQuestion(this.questionData).subscribe({
			next: () => {
				this.notifyTitle = '¡Gracias!';
				this.notifyMessage = 'Tu sugerencia ha sido enviada exitosamente.';
				this.notifyType = 'success';
				this.showModal = true;
				this.suggestedQuestion = '';
			},
			error: () => {
				this.notifyTitle = 'Error';
				this.notifyMessage = 'No se pudo enviar tu sugerencia. Intenta nuevamente.';
				this.notifyType = 'error';
				this.showModalError = true;
			}
		});
	}

	onNotifyClose() {
		this.showModal = false;
		this.showModalError = false;
	}

	private loadQuestions() {
		this.loading = true;
		this.faqService
			.getQuestions()
			.pipe(
				finalize(() => {
					this.loading = false;
					this.cd.detectChanges();
				})
			)
			.subscribe(
				(data) => {
					this.questions = data.data.filter((q: any) => q.suggested === false);
					this.cd.detectChanges();
				},
				(err) => {
					const notify = handleHttpError(err);
					console.log(notify);
					this.cd.detectChanges();
				}
			);
	}
}
