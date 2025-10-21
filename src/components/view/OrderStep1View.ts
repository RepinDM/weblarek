
import { Component } from "../base/Component";
import type { IBuyer, IBuyerChangedEvent } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class OrderStep1View extends Component<IBuyer> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<IBuyer> & { errors?: Record<string,string> }): HTMLElement {
    const buyer = data ?? {};
    const errors = data?.errors ?? {};

    const tpl = document.querySelector<HTMLTemplateElement>('#order')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const addressInput = el.querySelector<HTMLInputElement>('input[name="address"]')!;
    const cardBtn = el.querySelector<HTMLButtonElement>('button[name="card"]')!;
    const cashBtn = el.querySelector<HTMLButtonElement>('button[name="cash"]')!;
    const nextBtn = el.querySelector<HTMLButtonElement>('.order__button')!;

    addressInput.value = buyer.address ?? '';

    if (buyer.payment === 'card') cardBtn.classList.add('button_alt-active');
    if (buyer.payment === 'cash') cashBtn.classList.add('button_alt-active');

    addressInput.addEventListener('input', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, { field: 'address', value: addressInput.value });
    });

    cardBtn.addEventListener('click', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, { field: 'payment', value: 'card' });
    });

    cashBtn.addEventListener('click', () => {
        this.events?.emit<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, { field: 'payment', value: 'cash' });
    });

    nextBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        this.events?.emit('order:step1:next');
    });

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

