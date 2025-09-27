import { Api } from "../base/Api";  
import type {
  IShopCatalogResponse, // тип ответа сервера при запросе списка товаров
  IShopItem,          // тип одного товара
  ICheckoutData,     // структура данных заказа (от клиента к серверу)
  ICheckoutResponse,      // результат оформления заказа (от сервера к клиенту)
} from "../../types/index"

// Класс-обёртка для работы с API веб-ларька.
// Расширяет базовый класс Api и добавляет методы, специфичные для магазина.
export class LarekApi extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); // передаём параметры в базовый класс Api
  }

  // Получить список товаров с сервера
  public async getProducts(): Promise<IShopItem[]> {
    // Делаем GET-запрос к эндпоинту /product/
    const result = await this.get<IShopCatalogResponse>("/product/");
    // Из ответа берём только массив товаров
    return result.items;
  }

  // Отправить заказ на сервер
  public async postOrder(payload: ICheckoutData): Promise<ICheckoutResponse> {
    // Делаем POST-запрос к эндпоинту /order/
    const result = await this.post<ICheckoutResponse>("/order/", payload, "POST");
    return result; // Сервер вернёт id заказа, сумму и success:true/false
  }
}