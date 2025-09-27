import { Component } from "../base/Component";
import { IShopItem } from "../../types";
import { Card } from "./Card";

export class Catalog extends Component<IShopItem[]> {
    protected _gallery: HTMLElement;

    constructor(container: HTMLElement, protected cardClickHandler?: (event: MouseEvent) => void) {
        super(container);
        this._gallery = this.container.querySelector('.gallery') as HTMLElement;
        
        if (cardClickHandler) {
            this._gallery.addEventListener('click', cardClickHandler);
        }
    }

    set items(value: IShopItem[]) {
        this._gallery.innerHTML = '';
        value.forEach((item) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card__category"></div>
                <div class="card__image-container">
                    <img class="card__image" alt="${item.title}">
                </div>
                <div class="card__content">
                    <h3 class="card__title"></h3>
                    <p class="card__text"></p>
                </div>
                <div class="card__footer">
                    <span class="card__price"></span>
                    <button class="card__button"></button>
                </div>
            `;
            
            const card = new Card(cardElement, this.cardClickHandler);
            card.id = item.id;
            card.title = item.title;
            card.price = item.price;
            card.image = item.image;
            card.category = item.category;
            card.buttonText = item.price === null ? 'Недоступно' : 'В корзину';
            card.buttonDisabled = item.price === null;
            
            this._gallery.appendChild(cardElement);
        });
    }
}
