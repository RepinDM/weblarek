// src/components/view/BasketItemView.ts
import { Component } from "../base/Component";
import type { IShopItem } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

/**
 * Представление одной позиции в корзине.
 * render(data?: Partial<IShopItem>) — соответствует Component.
 */
export class BasketItemView extends Component<IShopItem> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<IShopItem>): HTMLElement {
    const item = data as IShopItem | undefined;
    const tpl = document.querySelector<HTMLTemplateElement>('#card-basket')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    if (!item) return el;

    el.querySelector('.basket__item-index')!.textContent = '1'; // индекс устанавливать сверху
    el.querySelector('.card__title')!.textContent = item.title;
    el.querySelector('.card__price')!.textContent = `${item.price ?? 0} синапсов`;

    const del = el.querySelector('.basket__item-delete') as HTMLElement;
    del.dataset.id = item.id;

    // событие удаления отправляем через EventEmitter
    del.addEventListener('click', () => {
        this.events?.emit(EVENTS.CARD_REMOVE, item.id);
    });

    return el;
    }
}

