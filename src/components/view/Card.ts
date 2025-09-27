import { Component } from "../base/Component";
import type { IShopItem } from "../../types";

export class Card extends Component<IShopItem> {
    render(data: IShopItem): HTMLElement {
    this.container.innerHTML = `
        <div class="card">
        <h3>${data.title}</h3>
        <p>${data.price ?? "Бесплатно"}</p>
        </div>
    `;
    return this.container;
    }
}
