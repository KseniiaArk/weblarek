import { IBuyer } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { MainForm } from "./MainForm";

export interface IOrderContactCallbacks {
    onSubmit?: (evt: Event) => void;
    onPhoneChange?: (phone: string) => void;
    onEmailChange?: (email: string) => void;
}

export class ContactForm extends MainForm {
    protected phoneInp: HTMLInputElement;
    protected emailInp: HTMLInputElement;

    constructor(container: HTMLElement, evt?: IOrderContactCallbacks) {
        super(container, evt);

        this.phoneInp = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.emailInp = ensureElement<HTMLInputElement>('input[name="email"]', this.container);

        this.setupPhoneCallback(evt?.onPhoneChange);
        this.setupEmailCallback(evt?.onEmailChange);
    }

    private setupPhoneCallback(onPhoneChange?: (phone: string) => void): void {
        this.phoneInp.addEventListener('input', () => {
            onPhoneChange?.(this.phone.trim());
        })
    }

    private setupEmailCallback(onEmailChange?: (email: string) => void): void {
        this.emailInp.addEventListener('input', () => {
            onEmailChange?.(this.email.trim());
        });
    }

    set phone(value: string) {
        this.phoneInp.value = value;
    }

    get phone(): string {
        return this.phoneInp.value.trim();
    }

    set email(value: string) {
        this.emailInp.value = value;
    }

    get email(): string {
        return this.emailInp.value.trim();
    }

    get itemsContactData(): Pick<IBuyer, 'email' | 'phone'> {
        const { email, phone } = this;
        return { email, phone };
    }
}