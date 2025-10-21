
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

    emailInput.addEventListener('input', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, { field: 'email', value: emailInput.value });
        this.events?.emit('order:step2:validate');
    });

    phoneInput.addEventListener('input', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, { field: 'phone', value: phoneInput.value });
        this.events?.emit('order:step2:validate');
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

    // слушаем внешнее событие, чтобы установить состояние кнопки
    this.events?.on && this.events.on('order:step2:setButton', (enabled?: boolean) => {
        payBtn.disabled = !enabled;
    });

    return el;
    }
}
