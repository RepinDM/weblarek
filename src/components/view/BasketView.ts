// src/components/view/BasketView.ts
import { Component } from "../base/Component";
import type { IShopItem } from "../../types";

export class BasketView extends Component {
    private _items: IShopItem[] = [];
    private _total = 0;
    private _buttonText = "Оформить";

    set items(items: IShopItem[]) {
        this._items = items;
        this.render();
    }

    set total(value: number) {
        this._total = value;
        this.render();
    }

    set buttonText(value: string) {
        this._buttonText = value;
        this.render();
    }

render(): HTMLElement {
    const tpl = document.querySelector<HTMLTemplateElement>('#basket')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const list = el.querySelector('.basket__list') as HTMLElement;
    const priceEl = el.querySelector('.basket__price') as HTMLElement;
    const btn = el.querySelector('.basket__button') as HTMLButtonElement;

    list.innerHTML = '';
    if (!this._items.length) {
        list.innerHTML = '<p>Корзина пуста</p>';
        btn.disabled = true;
    } else {
    this._items.forEach((item, idx) => {
        const itemTpl = document.querySelector<HTMLTemplateElement>('#card-basket')!;
        const itemEl = itemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
        itemEl.querySelector('.basket__item-index')!.textContent = String(idx + 1);
        itemEl.querySelector('.card__title')!.textContent = item.title;
        itemEl.querySelector('.card__price')!.textContent = `${item.price ?? 0} синапсов`;
        // delete button
        const del = itemEl.querySelector('.basket__item-delete') as HTMLElement;
        del.dataset.id = item.id;
        list.appendChild(itemEl);
    });
    btn.disabled = false;
    }

    priceEl.textContent = `${this._total} синапсов`;
    btn.textContent = this._buttonText;

    // контейнер готов
    return el;
    }
}

