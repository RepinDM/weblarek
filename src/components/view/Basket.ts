import { Component } from "../base/Component";
import { IShopItem } from "../../types";

export class Basket extends Component<IShopItem[]> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._list = this.container.querySelector('.basket__list') as HTMLElement;
        this._total = this.container.querySelector('.basket__total') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;
    }

    set items(value: IShopItem[]) {
        this._list.innerHTML = '';
        if (value.length === 0) {
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this._button.disabled = true;
            return;
        }
        
        this._button.disabled = false;
        value.forEach((item) => {
            const basketItem = document.createElement('div');
            basketItem.className = 'basket__item';
            basketItem.innerHTML = `
                <div class="basket__item-info">
                    <h3 class="basket__item-title"></h3>
                    <span class="basket__item-price"></span>
                </div>
                <button class="basket__item-remove">Удалить</button>
            `;
            
            const title = basketItem.querySelector('.basket__item-title') as HTMLElement;
            const price = basketItem.querySelector('.basket__item-price') as HTMLElement;
            const removeButton = basketItem.querySelector('.basket__item-remove') as HTMLButtonElement;
            
            title.textContent = item.title;
            price.textContent = `${item.price} синапсов`;
            
            removeButton.addEventListener('click', () => {
                this.emit('basket:remove', { id: item.id });
            });
            
            this._list.appendChild(basketItem);
        });
    }

    set total(value: number) {
        this.setText(this._total, `Итого: ${value} синапсов`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }
}
