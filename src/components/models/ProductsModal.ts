import type { IShopItem } from "../../types";     // Тип описания товара
import type { IEvents } from "../base/Events";  // Интерфейс для событийной шины
import { EVENTS } from "../base/EventNames";    // Константы с названиями событий

export class ProductsModel {
  // Внутреннее хранилище списка товаров
  private items: IShopItem[] = [];

  // Храним id выбранного товара (например, при открытии модального окна карточки товара)
  private selectedId: string | null = null;

  constructor(private events?: IEvents) {}

  // Установить новые товары (например, после запроса к API)
  public setItems(items: IShopItem[]) {
    this.items = [...items];                      // Создаём копию массива
    this.events?.emit(EVENTS.CATALOG_CHANGED, {}); // Уведомляем, что каталог изменился
  }

  // Получить список товаров
  public getItems(): IShopItem[] {
    return [...this.items]; // Возвращаем копию массива, чтобы извне нельзя было сломать оригинал
  }

  // Найти конкретный товар по его id
  public getItemById(id: string): IShopItem | undefined {
    return this.items.find((p) => p.id === id);
  }

  // Сохранить id выбранного товара (например, при клике по карточке)
  public setSelectedProduct(id: string | null) {
    this.selectedId = id;
    this.events?.emit(EVENTS.SELECT_CHANGED, {}); // Уведомляем об изменении выбранного товара
  }

  // Получить сам объект выбранного товара
  public getSelectedProduct(): IShopItem | null {
    if (!this.selectedId) return null;                      // Если ничего не выбрано
    return this.getItemById(this.selectedId) ?? null;       // Ищем товар по id
  }
}