
import { CartModel } from "../models/CardModel";
import { BasketView } from "../view/BasketView";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";
import { ICartCounterEvent } from "../../types";

/**
 * BasketPresenter слушает изменения в CartModel и обновляет BasketView.
 * Presenter сам не манипулирует DOM — он вызывает view.render с данными.
 */
export class BasketPresenter {
    constructor(
    private model: CartModel,
    private view: BasketView,
    private events: IEvents
    ) {
    this.events.on(EVENTS.CART_CHANGED, this.handleCartChange.bind(this));
    this.events.on(EVENTS.BASKET_OPEN, this.open.bind(this));
    }

    private handleCartChange() {
    const items = this.model.getItems();
    const total = this.model.getTotal();
    // обновляем view через метод render(data)
    this.view.render({ items, total });
    // обновляем счётчик в шапке через глобальное событие
    this.events.emit<ICartCounterEvent>('cart:counter', { count: this.model.getCount() });
    }

    private open() {
    // Presenter оповещает, оставил лог в случае необходимости
    this.events.emit(EVENTS.BASKET_OPEN);
    }

    public removeItem(id?: string): void {
        if (!id) return;
        this.model.remove(id);
    }

    public checkout(): void {
        this.events.emit(EVENTS.BASKET_CHECKOUT);
    }
}
