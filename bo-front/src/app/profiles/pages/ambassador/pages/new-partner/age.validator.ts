import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Valida que la fecha de nacimiento represente al menos `minYears` cumplidos.
 * @param minYears Edad mínima requerida (p. ej. 18)
 */
export function ageValidator(minYears: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    if (!val) {
      return null;
    }
    const birth = new Date(val);
    if (isNaN(birth.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= minYears
      ? null
      : { underage: { requiredAge: minYears, actualAge: age } };
  };
}
