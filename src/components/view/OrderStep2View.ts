
import { Component } from "../base/Component";
import type { IBuyer, IBuyerChangedEvent } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class OrderStep2View extends Component<IBuyer> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<IBuyer> & { errors?: Record<string,string> }): HTMLElement {
    const buyer = data ?? {};
    const errors = data?.errors ?? {};

    const tpl = document.querySelector<HTMLTemplateElement>('#contacts')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const emailInput = el.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phoneInput = el.querySelector<HTMLInputElement>('input[name="phone"]')!;
    const payBtn = el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    emailInput.value = buyer.email ?? '';
    phoneInput.value = buyer.phone ?? '';

    const updateButtonState = () => {
        payBtn.disabled = !(emailInput.value.trim() && phoneInput.value.trim());
    };

    emailInput.addEventListener('input', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_INPUT_CHANGED, { field: 'email', value: emailInput.value });
        updateButtonState();
    });

    phoneInput.addEventListener('input', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_INPUT_CHANGED, { field: 'phone', value: phoneInput.value });
        updateButtonState();
    });

    payBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        this.events?.emit('order:submit');
    });

    const errorsContainer = el.querySelector('.form__errors') as HTMLElement;
    errorsContainer.innerHTML = '';
    Object.values(errors).forEach(m => {
        const d = document.createElement('div');
        d.className = 'form__error';
        d.textContent = m;
        errorsContainer.appendChild(d);
    });

    updateButtonState();

    return el;
    }
}
