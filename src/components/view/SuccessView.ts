
import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class SuccessView extends Component<{ total: number }> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<{ total: number }>): HTMLElement {
    const total = data?.total ?? 0;
    const tpl = document.querySelector<HTMLTemplateElement>('#success')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    (el.querySelector('.order-success__description') as HTMLElement).textContent = `Списано ${total} синапсов`;

    el.querySelector('.order-success__close')?.addEventListener('click', () => {
        this.events?.emit(EVENTS.ORDER_SUBMITTED, { total });
    });

    return el;
    }
}
