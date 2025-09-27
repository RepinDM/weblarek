import { Api } from "../base/Api";
import type { IShopItem, IOrder, IOrderResponse } from "../../types";

export class LarekApi extends Api {
  // Получение списка товаров
  getProducts(): Promise<IShopItem[]> {
    return this.get("/products") as Promise<IShopItem[]>;
  }

  // Отправка заказа на сервер
  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.post("/order", order) as Promise<IOrderResponse>;
  }
}