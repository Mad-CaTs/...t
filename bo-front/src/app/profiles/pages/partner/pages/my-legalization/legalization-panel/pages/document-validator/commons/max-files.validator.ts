import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxFilesValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as File[];
    if (files && Array.isArray(files) && files.length > max) {
      return { maxFiles: { max } };
    }
    return null;
  };
}


