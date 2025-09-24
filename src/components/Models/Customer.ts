import { IBuyer, TPayment } from "../../types";

export class Customer {
    private _payment: TPayment = '';
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor() {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    setCustomerInfo(data: Partial<IBuyer>): void {
        const { payment, email, phone, address } = data;
    
        if (payment !== undefined) {
            this._payment = payment;
        }
        if (email !== undefined) {
            this._email = email;
        }
        if (phone !== undefined) this._phone = phone;
        if (address !== undefined) this._address = address;
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
    }

    validationCustomerInfo(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this._payment) errors.payment = 'Не выбран способ оплаты';
        if (!this._email) errors.email = 'Укажите электронную почту';
        if (!this._phone) errors.phone = 'Введите номер телефона';
        if (!this._address) errors.address = 'Необходим адрес доставки';
        
        return errors;
    }
}