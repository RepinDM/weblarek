import { Component } from "../base/Component";
import type { IShopItem } from "../../types";

export abstract class CardBase<T extends IShopItem = IShopItem> extends Component<T> {
    protected root: HTMLElement;
    constructor(container: HTMLElement) {
        super(container);
        this.root = container;
    }

    abstract render(data: T): HTMLElement;
}