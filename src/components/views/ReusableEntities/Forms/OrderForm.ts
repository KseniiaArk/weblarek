import { IBuyer, TPayment } from "../../../../types";
import { ensureAllElements, ensureElement } from "../../../../utils/utils";
import { MainForm } from "./MainForm";


export interface IOrderFormCallbacks {
    onSubmit?: (evt: Event) => void;
    onPaymentChange?: (payment: TPayment) => void;
    onAddressChange?: (address: string) => void;
}

export class OrderForm extends MainForm {
    protected payButtons: HTMLButtonElement[];
    protected addressForm: HTMLInputElement;
    protected chosenPay: TPayment = '';

    constructor(container: HTMLElement, callbacks?: IOrderFormCallbacks) {
        super(container, callbacks);

        this.payButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.addressForm = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.payButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.chosenPay = payment;
                this.chosenPaymentType(payment);
                callbacks?.onPaymentChange?.(payment);
            });
        });

        this.addressForm.addEventListener('input', () => {
            callbacks?.onAddressChange?.(this.addressForm.value);
        })
    }

    set payment(value: TPayment) {
        this.chosenPay = value;
        this.chosenPaymentType(value);
    }

    get payment(): TPayment {
        return this.chosenPay;
    }

    set address(value: string) {
        this.addressForm.value = value;
    }

    get address(): string {
        return this.addressForm.value;
    }

    chosenPaymentType(payment: TPayment): void {
        this.payButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === payment);
        });
    }

    get itemsOrderData(): Pick<IBuyer, 'payment' | 'address'> {
        const { payment, address } = this;
        return { payment, address };
    }
}


