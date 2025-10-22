import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Customer {
    private _payment: TPayment = '';
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(protected evt: IEvents) { }

    setCustomerInfo(data: Partial<IBuyer>): void {
        const { payment, email, phone, address } = data;
        //были ли изменения
        let changed = false;
    
        if (payment !== undefined) {
            this._payment = payment;
            changed = true;
        }
        if (email !== undefined) {
            this._email = email;
            changed = true;
        }
        if (phone !== undefined) {
            this._phone = phone;
            changed = true;
        }
        if (address !== undefined) {
            this._address = address;
            changed = true;
        }

        if (changed) this.validate();
    }

   getCustomerInfo(): IBuyer {
        const { _payment: payment, _email: email, _phone: phone, _address: address } = this;
        return { payment, email, phone, address };
    }

    clearCustomerInfo(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
        this.validate();
    }

    private static readonly ERROR_MESSAGES = {
        payment: 'Не выбран способ оплаты',
        email: 'Укажите электронную почту',
        phone: 'Введите номер телефона',
        address: 'Необходим адрес доставки'
    } as const;

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        const fieldHandlers = {
            payment: () => this._payment = value as TPayment,
            email: () => this._email = value as string,
            phone: () => this._phone = value as string,
            address: () => this._address = value as string
        };

        const handler = fieldHandlers[field];
        if (handler) {
            handler();
            this.validate();
        }
    }

    validationCustomerInfo(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this._payment) errors.payment = Customer.ERROR_MESSAGES.payment;
        if (!this._email) errors.email = Customer.ERROR_MESSAGES.email;
        if (!this._phone) errors.phone = Customer.ERROR_MESSAGES.phone;
        if (!this._address) errors.address = Customer.ERROR_MESSAGES.address;
        
        return errors;
    }

    validationOrderInfo(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this._payment) errors.payment = Customer.ERROR_MESSAGES.payment;
        if (!this._address.trim()) errors.address = Customer.ERROR_MESSAGES.address;

        return errors;
    }

    validationContactsInfo(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this._email.trim()) errors.email = Customer.ERROR_MESSAGES.email;
        if (!this._phone.trim()) errors.phone = Customer.ERROR_MESSAGES.phone;

        return errors;
    }

    

    private validate(): void {
        const errors: Record<string, string> = {};

        const hasOrderData = this._payment !== '' || this._address !== '';
        const hasContactData = this._email !== '' || this._phone !== '';

        if (hasOrderData) {
            const orderErrors = this.validationOrderInfo();
            Object.assign(errors, orderErrors);
        }

        if (hasContactData) {
            const contactErrors = this.validationContactsInfo();
            Object.assign(errors, contactErrors);
        }

        this.evt.emit('form:validate', errors);
    }
}