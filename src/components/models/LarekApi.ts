import { Api } from "../base/Api";
import type { IShopItem, IOrder, IOrderResponse } from "../../types";

export class LarekApi extends Api {
  // Получение списка товаров
  async getProducts(): Promise<IShopItem[]> {
    return (await this.get<{items: IShopItem[]}>("/product")).items;
  }

  // Отправка заказа на сервер
  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.post<IOrderResponse>("/order", order);
  }
}