import type { IShopItem } from "../../types"; // Тип товара
import type { IEvents } from "../base/Events"; // Интерфейс для событий 
import { EVENTS } from "../base/EventNames"; // Константы с названиями событий

export class CartModal {
    // ключ = id товара , значение = сам обьект товара
    private items: Map<string, IShopItem> = new Map();

    // events нужен для уведомления внешних компонентов об изменениях 
    constructor(private events?: IEvents) {}

    // Вернуть список товаров в корзине 
    public getItems(): IShopItem[] {
        // Преобразуем  Map в массив обьектов
        return Array.from(this.items.values());
    }

    // Добавить товар в корзину 
    public add(product: IShopItem) {
        if (!product?.id) return;  // Если товара нет или нет id => ничего не делать 
        if (product.price === null) return; // Товары без цены не добавляем 
        this.items.set(product.id, product); // Кладем товар в Map
        this.events?.emit(EVENTS.CART_CHANGED, {}); // Сообщаем ,что корзина изменилась
    }

    // Удалить товар из корзины 
    public remove(id: string) {
        this.items.delete(id);
        this.events?.emit(EVENTS.CART_CHANGED, {});
    }

    // Очистить корзину полностью
    public clear() {
        if (this.items.size) { // только если корзина не пуста 
            this.items.clear();
            this.events?.emit(EVENTS.CART_CHANGED, {}); // Уведомляем об изменениях
        }
    }
    // Получить количество товаров в корзине 
    public getCount(): number {
        return this.items.size;
    }

    // Проверить, есть ли товар в корзине 
    public has(id: string): boolean {
        return this.items.has(id);
    }

    // Посчитать итоговую сумму заказа
    public getTotal(): number {
        return Array.from(this.items.values()).reduce((sum, p) => {
            //Складываем цены, если цена - число, иначе добавляем 0
            return sum + (typeof p.price === "number" ? p.price : 0);
        }, 0);
    }
}