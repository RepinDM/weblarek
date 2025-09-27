import { CartModel } from "../models/CardModel";
import { Basket } from "../view/Basket";
import { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class BasketPresenter {
    constructor(
    private model: CartModel,
    private view: Basket,
    private events: IEvents
    ) {
    this.events.on(EVENTS.CART_CHANGED, this.handleCartChange.bind(this));
    this.events.on(EVENTS.BASKET_OPEN, this.open.bind(this));
    this.events.on(EVENTS.BASKET_CHECKOUT, this.checkout.bind(this));
}

private handleCartChange() {
    this.view.items = this.model.getItems();
    this.view.total = this.model.getTotal();
    this.view.buttonText = "Оформить заказ";
}

private open() {
    console.log("Корзина открыта");
}

private checkout() {
    console.log("Оформление заказа");
    }
}
