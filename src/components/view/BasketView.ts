
import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";
import { BasketItemView } from "./BasketItemView";
import type { IShopItem } from "../../types";

/**
 * BasketView: принимает данные в render и ничего не хранит лишнего.
 * Сигнатура: render(data?: Partial<{ items: IShopItem[]; total: number; buttonText?: string }>)
 */
export class BasketView extends Component<{ items: IShopItem[]; total: number; buttonText?: string }> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<{ items: IShopItem[]; total: number; buttonText?: string }>): HTMLElement {
    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const buttonText = data?.buttonText ?? 'Оформить';

    const tpl = document.querySelector<HTMLTemplateElement>('#basket')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const list = el.querySelector('.basket__list') as HTMLElement;
    const priceEl = el.querySelector('.basket__price') as HTMLElement;
    const btn = el.querySelector('.basket__button') as HTMLButtonElement;

    list.innerHTML = '';

    if (!items.length) {
        list.innerHTML = '<p>Корзина пуста</p>';
        btn.disabled = true;
    } else {
        items.forEach((item, idx) => {
        // используем отдельное представление для каждой карточки
        const itemContainer = document.createElement('div');
        const itemView = new BasketItemView(itemContainer, this.events);
        const itemEl = itemView.render({ ...item, index: idx + 1 });
        list.appendChild(itemEl);
        });
        btn.disabled = false;
    }

    priceEl.textContent = `${total} синапсов`;
    btn.textContent = buttonText;

    btn.addEventListener('click', () => {
        this.events?.emit(EVENTS.BASKET_CHECKOUT);
    });

    return el;
    }
}

