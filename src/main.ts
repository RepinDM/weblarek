// Подключаем стили SCSS
import "./scss/styles.scss";

// Импортируем тестовые данные (локальный каталог товаров)
import { apiProducts } from "./utils/data";

// Модель для работы с товарами (каталог)
import { ProductsModel } from "./components/models/ProductsModal";

// Модель для работы с корзиной
import { CartModal } from "./components/models/CardModel";

// Модель для работы с данными покупателя (форма оформления заказа)
import { BuyerModel } from "./components/models/BuyerModel";

// Базовый URL API
import { API_URL } from "./utils/constants";

// Класс для работы с серверным API
import { LarekApi } from "./components/models/LarekApi";

// Создаём экземпляр API-клиента
const larekApi = new LarekApi(API_URL); // Исправлено: WLarekApi -> larekApi

// Создаём модель каталога товаров
const productsModel = new ProductsModel();


// Проверка работы каталога


// Записываем в модель тестовые данные (из локального файла data.ts)
productsModel.setItems(apiProducts.items);

// Проверяем работу методов модели
console.log("Каталог — всего:", productsModel.getItems().length); // сколько всего товаров
console.log("Каталог — первый товар:", productsModel.getItems()[0]); // первый элемент массива

// Сохраняем id первого товара и выбираем его
const firstId = productsModel.getItems()[0]?.id;
productsModel.setSelectedProduct(firstId ?? null);

// Проверяем, что выбранный товар сохранился
console.log("Выбранный товар:", productsModel.getSelectedProduct());


// Проверка работы корзины


// Создаём пустую корзину
const cartModel = new CartModal();

// Ищем первый товар, у которого задана цена (price !== null)
const firstPaidProduct = productsModel
  .getItems()
  .find((p) => typeof p.price === "number");

// Если такой товар есть, добавляем его в корзину
if (firstPaidProduct) {
  cartModel.add(firstPaidProduct);
}

// Проверяем, что корзина обновилась
console.log("Корзина — список:", cartModel.getItems());
console.log("Корзина — кол-во:", cartModel.getCount());
console.log("Корзина — сумма:", cartModel.getTotal());

// Удаляем товар из корзины и проверяем состояние
if (firstPaidProduct) {
  cartModel.remove(firstPaidProduct.id);
}
console.log(
  "Корзина — после удаления:",
  cartModel.getItems(),
  "Кол-во:",
  cartModel.getCount()
);


// Проверка работы покупателя


// Создаём модель покупателя (данные заказа)
const buyer = new BuyerModel();

// Хелпер для логирования ошибок валидации (чтобы не дублировать код)
const logErrors = (label: string, obj: object) =>
  console.log(label, Object.keys(obj).length ? obj : "нет ошибок");

// Проверяем начальное состояние
console.log("Buyer — начальные данные:", buyer.getData()); 
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

// Устанавливаем способ оплаты
buyer.setPayment("card");
console.log("Buyer — после setPayment:", buyer.getData()); 
logErrors("Step1 (address):", buyer.validateStep1());

// Добавляем адрес
buyer.setAddress("г. Москва, пр-т Мира, 1");
console.log("Buyer — после setAddress:", buyer.getData()); 
logErrors("Step1 (нет ошибок):", buyer.validateStep1());

// Проверяем второй шаг — почта и телефон ещё пустые
logErrors("Step2 (email,phone):", buyer.validateStep2());

// Добавляем email
buyer.setEmail("user@example.com");
console.log("Buyer — после setEmail:", buyer.getData()); 
logErrors("Step2 (phone):", buyer.validateStep2());

// Добавляем телефон
buyer.setPhone("+7 999 000-00-00");
console.log("Buyer — после setPhone:", buyer.getData()); 
logErrors("Step2 (нет ошибок):", buyer.validateStep2());

// Проверка на некорректный адрес (пустая строка)
buyer.setAddress("   ");
logErrors("Step1 (некорректные значения):", buyer.validateStep1());

// Сбрасываем все данные покупателя
buyer.clear();
console.log("Buyer — после clear():", buyer.getData()); 
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

// Проверка связи с серверным API
(async () => {
  try {
    // Загружаем каталог товаров с сервера
    const items = await larekApi.getProducts(); 

    // Обновляем модель каталога
    productsModel.setItems(items);

    // Проверяем, что данные сохранились
    console.log("Каталог (с сервера):", productsModel.getItems());
    console.log("Всего товаров:", productsModel.getItems().length);
  } catch (error) {
    // Обрабатываем ошибку при запросе
    console.error("Ошибка загрузки каталога:", error);
  }
})();