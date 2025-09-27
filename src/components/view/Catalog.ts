import { Component } from "../base/Component";
import type { IShopItem } from "../../types";
import { Card } from "./Card";

export class Catalog extends Component<IShopItem[]> {
    set items(data: IShopItem[]) {
    this.container.innerHTML = "";
    data.forEach((item) => {
        const card = new Card(document.createElement("div"));
        this.container.appendChild(card.render(item));
    });
    }
}
