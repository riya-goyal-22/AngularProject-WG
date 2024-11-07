import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null; // No validation errors if control is empty
        }

        // Regular expressions for special characters and digits
        const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasNumber = /\d/.test(value);

        // Check if both conditions are met
        if (!hasSpecialCharacter || !hasNumber) {
            return {
                passwordStrength: {
                    hasSpecialCharacter,
                    hasNumber
                }
            };
        }

        return null; // Valid if both conditions are met
    };
}
