import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@app/core/services/toast.service';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { handleHttpError } from '@app/event/utils/handle-http-error.util';

import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { ListToolbarComponent } from '@app/event/components/shared/list-toolbar/list-toolbar.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { ModalNotifyComponent } from '@app/entry/components/modals/modal-notify/modal-notify.component';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { FrequentlyAskedQuestion } from '@app/tools/models/frequently-question.model';
import { FrequentlyQuestionsService } from '@app/tools/services/frequently-questions.service';
import { ModalConfirmAcceptedComponent } from '@app/tools/components/modal-confirm-accepted/modal-confirm-accepted.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FrequentlyAskedQuestionRequest } from '@app/tools/models/frequently-question.model';

@Component({
	selector: 'app-frequently-asked-questions',
	standalone: true,
	imports: [
		CommonModule,
		EmptyStateComponent,
		FormControlModule,
		FormsModule,
		TableGenericComponent,
		TablePaginatorComponent,
		ReactiveFormsModule,
		ListToolbarComponent,
		ModalConfirmDeleteComponent,
		ModalNotifyComponent,
		ClipboardModule,
		ModalConfirmAcceptedComponent
	],
	templateUrl: './frequently-asked-questions.component.html',
	styleUrls: ['./frequently-asked-questions.component.scss']
})
export class FrequentlyAskedQuestionsComponent implements OnInit {
	loading: boolean = true;
	showNotify: boolean = false;
	notifyTitle: string = '';
	notifyMessage: string = '';
	notifyType: 'success' | 'error' = 'success';
	table: any;
	// Para preguntas normales
	pageIndexQuestions = 1;
	pageSizeQuestions = 10;

	// Para sugeridas
	pageIndexSuggested = 1;
	pageSizeSuggested = 10;
	activeTab: 'crear' | 'sugeridas' = 'crear';

	editMode = false;
	//Variables para el toolbar
	currentSearchQuestions: string = '';
	currentSearchSuggested: string = '';

	//Variables para el formulario
	suggestedQuestions: FrequentlyAskedQuestion[] = [];
	questions: FrequentlyAskedQuestion[] = [];
	filteredQuestions: FrequentlyAskedQuestion[] = [];
	filteredSuggestedQuestions: FrequentlyAskedQuestion[] = [];
	questionData: FrequentlyAskedQuestion | null = null;

	//Variables de acciones
	showDeleteModal: boolean = false;
	selectedToDelete: FrequentlyAskedQuestion | null = null;
	showDenyModal: boolean = false;
	selectedToDeny: FrequentlyAskedQuestion | null = null;
	showAcceptModal: boolean = false;
	selectedToAccept: FrequentlyAskedQuestion | null = null;

	private resetTimeoutId: any;
	private resetIntervalId: any;
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		private frequentlyAskedQuestionsService: FrequentlyQuestionsService,
		private modalService: NgbModal,
		private builder: FormBuilder,
		private cd: ChangeDetectorRef,
		private toastService: ToastService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.cd.detectChanges();

		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.editMode = true;
			this.frequentlyAskedQuestionsService.getQuestionById(+id).subscribe({
				next: (question) => {
					this.questionData = question;
					this.cd.detectChanges();
				},
				error: () => {
					this.notifyType = 'error';
					this.notifyTitle = 'Error al cargar pregunta';
					this.notifyMessage = 'No se pudo cargar la pregunta para editar.';
					this.showNotify = true;
					this.cd.detectChanges();
				}
			});
		} else {
			this.editMode = false;
			this.questionData = null;
		}
		this.loadQuestions();
	}

	setActiveTab(tab: 'crear' | 'sugeridas'): void {
		this.loading = true;
		this.activeTab = tab;
		this.loadQuestions();
	}

	onSearchQuestions(value: string) {
		this.currentSearchQuestions = value.trim().toLowerCase();
		this.filteredQuestions = this.questions.filter(
			(q) =>
				q.question.toLowerCase().includes(this.currentSearchQuestions) ||
				q.description.toLowerCase().includes(this.currentSearchQuestions) ||
				String(q.id).includes(this.currentSearchQuestions)
		);
		this.pageIndexQuestions = 1;
	}

	onSearchSuggested(value: string) {
		this.currentSearchSuggested = value.trim().toLowerCase();
		this.filteredSuggestedQuestions = this.suggestedQuestions.filter(
			(q) =>
				q.question.toLowerCase().includes(this.currentSearchSuggested) ||
				q.description.toLowerCase().includes(this.currentSearchSuggested) ||
				String(q.id).includes(this.currentSearchSuggested)
		);
		this.pageIndexSuggested = 1;
	}

	onEdit(row: FrequentlyAskedQuestion) {
		this.router.navigate(['edit', row.id], { relativeTo: this.route });
	}

	onAdd() {
		this.router.navigate(['new'], { relativeTo: this.route });
	}

	onDelete(row: FrequentlyAskedQuestion): void {
		this.selectedToDelete = row;
		this.showDeleteModal = true;
	}
	onAccept(row: FrequentlyAskedQuestion): void {
		this.selectedToAccept = row;
		this.selectedToAccept.suggested = false; //deja de ser una pregunta sugerida
		this.showAcceptModal = true;
	}

	onDeny(row: FrequentlyAskedQuestion): void {
		this.selectedToDeny = row;
		this.showDenyModal = true;
	}

	onConfirmDelete(): void {
		this.showDeleteModal = false;
		this.confirmDelete();
	}

	onConfirmDeny(): void {
		this.showDenyModal = false;
		this.confirmDeny();
	}

	onConfirmAccept(): void {
		this.showAcceptModal = false;
		this.confirmAccept();
	}

	onCancelDelete(): void {
		this.showDeleteModal = false;
	}

	onCancelDeny(): void {
		this.showDenyModal = false;
	}

	onCancelAccept(): void {
		this.showAcceptModal = false;
	}

	onPageChangeQuestions(page: number) {
		this.pageIndexQuestions = page;
	}

	onPageSizeChangeQuestions(size: number) {
		this.pageSizeQuestions = size;
		this.pageIndexQuestions = 1; // reset
	}

	onPageChangeSuggested(page: number) {
		this.pageIndexSuggested = page;
	}

	onPageSizeChangeSuggested(size: number) {
		this.pageSizeSuggested = size;
		this.pageIndexSuggested = 1; // reset
	}

	onNotifyClose(): void {
		this.showNotify = false;
	}

	ngOnDestroy() {
		clearTimeout(this.resetTimeoutId);
		clearInterval(this.resetIntervalId);
	}

	get visibleColumnsQuestions(): string[] {
		return ['Pregunta', 'Respuesta', 'Imagen'];
	}

	get visibleKeysQuestions(): string[] {
		return ['question', 'description', 'imageurl'];
	}

	get visibleColumnsSuggested(): string[] {
		return ['Pregunta', 'Socio(a)', ''];
	}

	get visibleKeysSuggested(): string[] {
		return ['question', 'usermember', 'imageurl'];
	}

	get pagedDataQuestions(): FrequentlyAskedQuestion[] {
		const start = (this.pageIndexQuestions - 1) * this.pageSizeQuestions;
		return this.filteredQuestions.slice(start, start + this.pageSizeQuestions);
	}

	get pagedDataSuggested(): FrequentlyAskedQuestion[] {
		const start = (this.pageIndexSuggested - 1) * this.pageSizeSuggested;
		return this.filteredSuggestedQuestions.slice(start, start + this.pageSizeSuggested);
	}

	private loadQuestions() {
		this.loading = true;
		this.frequentlyAskedQuestionsService
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
					this.suggestedQuestions = data.data.filter((q: any) => q.suggested === true);
					this.filteredQuestions = [...this.questions];
					this.filteredSuggestedQuestions = [...this.suggestedQuestions];
					this.cd.detectChanges();
				},
				(err) => {
					const notify = handleHttpError(err);
					this.notifyType = notify.notifyType;
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			);
	}

	private confirmDelete(): void {
		if (!this.selectedToDelete) return;
		this.showLoadingModal();
		this.frequentlyAskedQuestionsService
			.deleteQuestion(this.selectedToDelete.id)
			.pipe(finalize(() => this.hideLoadingModal()))
			.subscribe(
				() => {
					this.notifyType = 'success';
					this.notifyTitle = 'Eliminado';
					this.notifyMessage = `La pregunta "${
						this.selectedToDelete!.question
					}" ha sido eliminada.`;
					this.showNotify = true;
					this.loadQuestions();
					this.cd.detectChanges();
				},
				(err) => {
					const notify = handleHttpError(err);
					this.notifyType = notify.notifyType;
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			);
	}

	private confirmDeny(): void {
		if (!this.selectedToDeny) return;
		this.showLoadingModal();
		this.frequentlyAskedQuestionsService
			.deleteQuestion(this.selectedToDeny.id)
			.pipe(finalize(() => this.hideLoadingModal()))
			.subscribe(
				() => {
					this.notifyType = 'success';
					this.notifyTitle = 'Rechazada';
					this.notifyMessage = `La pregunta sugerida "${
						this.selectedToDeny!.question
					}" ha sido eliminada.`;
					this.showNotify = true;
					this.loadQuestions();
					this.cd.detectChanges();
				},
				(err) => {
					const notify = handleHttpError(err);
					this.notifyType = notify.notifyType;
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			);
	}

	private confirmAccept(): void {
		if (!this.selectedToAccept) return;
		this.showLoadingModal();

		const request: FrequentlyAskedQuestionRequest = {
			question: this.selectedToAccept.question,
			description: this.selectedToAccept.description,
			suggested: this.selectedToAccept.suggested,
			usermember: this.selectedToAccept.usermember,
			imageurl: this.selectedToAccept.imageurl
		};

		this.frequentlyAskedQuestionsService
			.updateQuestion(request, this.selectedToAccept.id) // ✅ ahora sí coincide
			.pipe(finalize(() => this.hideLoadingModal()))
			.subscribe(
				() => {
					this.notifyType = 'success';
					this.notifyTitle = 'Aceptada';
					this.notifyMessage = `La pregunta sugerida "${
						this.selectedToAccept!.question
					}" ha sido aceptada.`;
					this.showNotify = true;
					this.loadQuestions();
					this.cd.detectChanges();
				},
				(err) => {
					const notify = handleHttpError(err);
					this.notifyType = notify.notifyType;
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		this.loadingModalRef?.close();
		this.loadingModalRef = null;
	}
}
