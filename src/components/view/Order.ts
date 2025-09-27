import { Component } from "../base/Component";

export class Order extends Component<{ payment: string; address: string; email: string; phone: string }> {
    protected _payment: HTMLSelectElement;
    protected _address: HTMLInputElement;
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _button: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._payment = this.container.querySelector('.form__input[name="payment"]') as HTMLSelectElement;
        this._address = this.container.querySelector('.form__input[name="address"]') as HTMLInputElement;
        this._email = this.container.querySelector('.form__input[name="email"]') as HTMLInputElement;
        this._phone = this.container.querySelector('.form__input[name="phone"]') as HTMLInputElement;
        this._button = this.container.querySelector('.form__button') as HTMLButtonElement;
        this._errors = this.container.querySelector('.form__errors') as HTMLElement;
    }

    set payment(value: string) {
        this._payment.value = value;
    }

    set address(value: string) {
        this._address.value = value;
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set errors(value: Record<string, string>) {
        this._errors.innerHTML = '';
        Object.entries(value).forEach(([, message]) => {
            const errorElement = document.createElement('div');
            errorElement.className = 'form__error';
            errorElement.textContent = message;
            this._errors.appendChild(errorElement);
        });
    }

    get payment(): string {
        return this._payment.value;
    }

    get address(): string {
        return this._address.value;
    }

    get email(): string {
        return this._email.value;
    }

    get phone(): string {
        return this._phone.value;
    }
}
