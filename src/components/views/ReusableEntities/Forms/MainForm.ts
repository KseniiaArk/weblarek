import { IFormSubmit } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

export abstract class MainForm extends Component<void> {
    protected formSubmit: HTMLButtonElement;
    protected formError: HTMLElement;

    constructor(container: HTMLElement, evt?: IFormSubmit) {
        super(container);

        this.formSubmit = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formError = ensureElement<HTMLElement>('.form__errors', this.container);

        if (evt?.onSubmit) this.container.addEventListener('submit', evt.onSubmit);
    }

    set valid(isValid: boolean) {
        this.formSubmit.disabled = !isValid;
    }

    set errorText(text: string) {
        this.formError.textContent = String(text);
    }

    clearErrors(): void {
        this.errorText = '';
    }

    setValidationError(er: Record<string, string>): void {
        const textMessage = this.extractErrorMessages(er);

        if (this.hasErrors(textMessage)) {
            this.displayErrors(textMessage);
            this.valid = false;
        } else {
            this.clearErrors();
            this.valid = true;
        }
    }

    private extractErrorMessages(er: Record<string, string>): string[] {
        return Object.values(er).filter(Boolean);
    }

    private hasErrors(message: string[]): boolean {
        return message.length > 0;
    }

    private displayErrors(message: string[]): void {
        this.errorText = message.join(', ');
    }

}