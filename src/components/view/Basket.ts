import { Component } from "../base/Component";
import type { IShopItem } from "../../types";

export class Basket extends Component {
    private _items: IShopItem[] = [];
    private _total: number = 0;
    private _buttonText: string = "Оформить";

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
        this.container.innerHTML = `
        <ul>
            ${this._items.map((item) => `<li>${item.title} - ${item.price ?? 0}₽</li>`).join("")}
        </ul>
        <p>Итого: ${this._total}₽</p>
        <button>${this._buttonText}</button>
        `;
        return this.container;
    }
    }
