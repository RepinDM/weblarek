import { Component } from "../base/Component";
import { IShopItem } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";

export class Card extends Component<IShopItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected onClick?: (event: MouseEvent) => void) {
        super(container);
        
        this._title = this.container.querySelector('.card__title') as HTMLElement;
        this._price = this.container.querySelector('.card__price') as HTMLElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._button = this.container.querySelector('.card__button') as HTMLButtonElement;

        if (onClick) {
            this.container.addEventListener('click', onClick);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set image(value: string) {
        this.setImage(this._image, CDN_URL + '/' + value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this._category.className = 'card__category ' + categoryClass;
        }
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    set buttonVisible(value: boolean) {
        this._button.style.display = value ? 'block' : 'none';
    }
}

