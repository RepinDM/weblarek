
import type { IShopItem } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class CartModel {
    private items: Map<string, IShopItem> = new Map();

    constructor(private events?: IEvents) {}

    getItems(): IShopItem[] {
        return Array.from(this.items.values());
    }

    add(product: IShopItem) {
        if (!product?.id) return;
        if (product.price === null) return;
        this.items.set(product.id, product);
        this.events?.emit(EVENTS.CART_CHANGED);
    }

    remove(id: string) {
        this.items.delete(id);
        this.events?.emit(EVENTS.CART_CHANGED);
    }

    clear() {
        if (this.items.size) {
        this.items.clear();
        this.events?.emit(EVENTS.CART_CHANGED);
        }
    }

    getCount(): number {
        return this.items.size;
    }

    has(id: string): boolean {
        return this.items.has(id);
    }

    getTotal(): number {
        return Array.from(this.items.values()).reduce((sum, p) => sum + (p.price ?? 0), 0);
    }
}

