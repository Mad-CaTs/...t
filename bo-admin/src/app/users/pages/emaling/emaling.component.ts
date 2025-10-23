import { ChangeDetectorRef, Component } from '@angular/core';
import { tableData } from './mock';
import { EmailingModalComponent } from '../../components/modals';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailingService } from '@app/users/services/emailing.service';
import { IEmailingTableData } from '@interfaces/users.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-emaling',
    templateUrl: './emaling.component.html',
    styleUrls: ['./emaling.component.scss']
})
export class EmalingComponent {
    dataBody: IEmailingTableData[] = [];
    form: FormGroup;
    buttonLoading: boolean = false;
    suggestions: IEmailingTableData[] = [];
    showDropdown: boolean = false;
    private searchSubject = new Subject<string>();

    constructor(
        private formBuilder: FormBuilder,
        public modal: NgbModal,
        private emailingService: EmailingService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            search: ['']
        });
    }

    ngOnInit(): void {
        // Set up real-time search with debounce
        this.searchSubject
            .pipe(
                debounceTime(300), // Wait 300ms after typing stops
                distinctUntilChanged(), // Only proceed if input changes
                switchMap((searchTerm) => {
                    if (searchTerm.length >= 3) {
                        return this.emailingService.getUserDetail(searchTerm);
                    } else {
                        return [];
                    }
                })
            )
            .subscribe(
                (data: IEmailingTableData[]) => {
                    this.suggestions = data || [];
                    this.showDropdown = this.suggestions.length > 0 && this.form.get('search')?.value.length >= 3;
                    this.cdr.detectChanges();
                },
                (error) => {
                    console.error('Error fetching suggestions', error);
                    this.suggestions = [];
                    this.showDropdown = false;
                    this.cdr.detectChanges();
                }
            );
    }

    onSearchInput(event: Event): void {
        const input = (event.target as HTMLInputElement).value.trim();
        this.searchSubject.next(input);
        if (!input) {
            this.suggestions = [];
            this.showDropdown = false;
            this.cdr.detectChanges();
        }
    }

    selectSuggestion(username: string): void {
        this.form.get('search')?.setValue(username);
        this.suggestions = [];
        this.showDropdown = false;
        this.cdr.detectChanges();
        this.onSearch(); // Trigger the same search action as the "Buscar" button
    }

    onSearch(): void {
        this.buttonLoading = true;
        this.showDropdown = false; // Hide dropdown when button is clicked
        const search = this.form.get('search')?.value.trim();
        if (!search) {
            this.dataBody = [];
            this.buttonLoading = false;
            this.cdr.detectChanges();
            return;
        }
        this.emailingService.getUserDetail(search).subscribe(
            (data: IEmailingTableData[]) => {
                if (!data) {
                    console.log("Usuario no encontrado");
                    this.buttonLoading = false;
                    this.cdr.detectChanges();
                } else {
                    if (data.length === 0) {
                        console.log('No data found for the search input:', search);
                        this.dataBody = [];
                        this.buttonLoading = false;
                    } else {
                        this.dataBody = data;
                        this.buttonLoading = false;
                    }
                    this.cdr.detectChanges();
                }
            },
            (error) => {
                console.error('Error fetching user detail', error);
                this.dataBody = [];
                this.buttonLoading = false;
                console.log('Error occurred. Resetting dataBody to empty array.');
                console.log('Updated dataBody:', this.dataBody);
                this.cdr.detectChanges();
            }
        );
    }

    onOpenEmailing(id: string, emailingData: IEmailingTableData) {
        const ref = this.modal.open(EmailingModalComponent, {
            centered: true,
            size: 'lg'
        });
        const modal = ref.componentInstance as EmailingModalComponent;

        modal.id = id;
        modal.emailingData = emailingData;
    }
}
