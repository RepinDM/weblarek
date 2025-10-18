// src/components/presenter/BasketPresenter.ts
import { CartModel } from "../models/CardModel";
import { BasketView } from "../view/BasketView.ts";
import { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class BasketPresenter {
    constructor(
        private model: CartModel,
        private view: BasketView,
        private events: IEvents
    ) {
        this.events.on(EVENTS.CART_CHANGED, this.handleCartChange.bind(this));
        this.events.on(EVENTS.BASKET_OPEN, this.open.bind(this));

    // слушаем клики внутри контейнера вида корзины (удаление / оформление)
    // Но вид корзины рендерится в содержимое модального окна — презентер должен обрабатывать удаление через делегирование событий от модального содержимого.
    }

    private handleCartChange() {
        this.view.items = this.model.getItems();
        this.view.total = this.model.getTotal();
    // обновить счётчик в шапке (emit события)
        this.events.emit('cart:counter', { count: this.model.getCount() });
    }

    private open() {
    // логика открытия обрабатывается в основном презентере: отрисовать вид корзины в модальном окне и открыть модал
        console.log('Basket should open — presenter notified');
    }

    public removeItem(id: string) {
        this.model.remove(id);
    }

    public checkout() {
        this.events.emit(EVENTS.BASKET_CHECKOUT);
    }
}
