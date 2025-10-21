
import { Component } from "../base/Component";
import type { IBuyer } from "../../types";

export class OrderFormView extends Component {
    constructor(container: HTMLElement) {
        super(container);
    }

renderStep1(buyer: Partial<IBuyer> = {}, errors: Record<string,string> = {}) {
    const tpl = document.querySelector<HTMLTemplateElement>('#order')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    // заполнить значения
    const addressInput = el.querySelector<HTMLInputElement>('input[name="address"]')!;
    const cardBtn = el.querySelector<HTMLButtonElement>('button[name="card"]')!;
    const cashBtn = el.querySelector<HTMLButtonElement>('button[name="cash"]')!;
    // кнопку отправки обрабатывает вызывающий код, здесь только рендерим форму

    addressInput.value = buyer.address || '';
    if (buyer.payment === 'card') cardBtn.classList.add('button_alt-active');
    if (buyer.payment === 'cash') cashBtn.classList.add('button_alt-active');

    // ошибки
    const errorsContainer = el.querySelector('.form__errors') as HTMLElement;
    errorsContainer.innerHTML = '';
    Object.values(errors).forEach(m => {
        const d = document.createElement('div');
        d.className = 'form__error';
        d.textContent = m;
        errorsContainer.appendChild(d);
    });

    return el;
    }

renderStep2(buyer: Partial<IBuyer> = {}, errors: Record<string,string> = {}) {
    const tpl = document.querySelector<HTMLTemplateElement>('#contacts')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const emailInput = el.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phoneInput = el.querySelector<HTMLInputElement>('input[name="phone"]')!;
    emailInput.value = buyer.email || '';
    phoneInput.value = buyer.phone || '';

    const errorsContainer = el.querySelector('.form__errors') as HTMLElement;
    errorsContainer.innerHTML = '';
    Object.values(errors).forEach(m => {
        const d = document.createElement('div');
        d.className = 'form__error';
        d.textContent = m;
        errorsContainer.appendChild(d);
    });

    return el;
    }
}
