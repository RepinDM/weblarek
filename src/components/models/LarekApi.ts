import { Api } from "../base/Api";
import type { IShopItem, IOrder, IOrderResponse } from "../../types";

export class LarekApi extends Api {
  // Получение списка товаров
  getProducts(): Promise<IShopItem[]> {
    return this.get<IShopItem[]>("/products");
  }

  // Отправка заказа на сервер
  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.post<IOrderResponse>("/order", order);
  }
}