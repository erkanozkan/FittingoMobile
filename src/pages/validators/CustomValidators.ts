import { FormGroup } from "@angular/forms";

interface ValidationResult {
    [key: string]: boolean;
}

export class CustomValidators {

    public static checkFirstCharacterValidator(control: FormGroup): ValidationResult {
        var valid = /^\d/.test(control.value);
        if (valid) {
            return {checkFirstCharacterValidator: true};
        }
        return null;
    }
}