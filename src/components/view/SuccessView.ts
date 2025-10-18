// src/components/view/SuccessView.ts
import { Component } from "../base/Component";

export class SuccessView extends Component {
    render(data?: string | Partial<{ message?: string }>): HTMLElement {
    const message = typeof data === 'string' ? data : (data && data.message) ?? 'Заказ оформлен';
    const tpl = document.querySelector<HTMLTemplateElement>('#success')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    // можно модифицировать текст
    (el.querySelector('.order-success__description') as HTMLElement).textContent = message;
    return el;
    }
}
