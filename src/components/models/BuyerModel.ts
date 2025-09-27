import type { TPayment } from "../../types"; // Тип для способа оплаты
import type { IEvents } from "../base/Events"; // Интерфейс событий системы
import { EVENTS } from "../base/EventNames"; // Словарь событий системы 

//Ошибка на 1ом шаге
// Если свойство невалидно, в обьекте появится свойство с текстом ошибки
type Step1Errors = { payment?: string; address?: string };

// Ошибки на 2ом шаге(email + phone)
type Step2Errors = { email?: string; phone?: string };

export class BuyerModel {
    // Данные покупателя 
    private payment?: TPayment; // способ оплаты
    private address?: string; // адрес доставки
    private email?: string; // email
    private phone?: string; // телефон

    // events - опционально, чтобы модель могла сообщать об изменениях
    constructor(private events?: IEvents) {}

    // Методы для работы с полями

    //Установка способа оплаты 
    public setPayment(payment: TPayment) {
        this.payment = payment;
        this.events?.emit(EVENTS.BUYER_CHANGED, {}); //Уведомляем подписчиков, что данные изменелись 
    }
    public getPayment(): TPayment | undefined {
        return this.payment;
    }

    //Установка адреса 
    public setAddress(address: string) {
        this.address = address;
        this.events?.emit(EVENTS.BUYER_CHANGED, {});
    }
    public getAddress(): string | undefined {
        return this.address;
    }

    // Установка email
    public setEmail(email: string) {
        this.email = email;
        this.events?.emit(EVENTS.BUYER_CHANGED, {});
    }
    public getEmail(): string | undefined {
        return this.email;
    }

    // Установка телефона
    public setPhone(phone: string) {
        this.phone = phone;
        this.events?.emit(EVENTS.BUYER_CHANGED, {})
    }
    public getPhone(): string | undefined {
        return this.phone;
    }

    // Сброс данных покупателя (после оформления заказа)
    public reset() {
        this.payment = undefined;
        this.address = undefined;
        this.email = undefined;
        this.phone = undefined;
        this.events?.emit(EVENTS.BUYER_CHANGED, {});
    }

     // Валидация 
     // Проверка первого шага (оплата + адрес)
     // Возвращает объект с ошибками - удобно для отображения на форме
    public validateStep1(): Step1Errors {
        const errors: Step1Errors = {};
        if (!this.payment) errors.payment = "Выберите способ оплаты" ;
        if (!this.address || !this.address.trim())
            errors.address = "Необходимо указать адрес";
        return errors;
    }

     // Проверка второго шага (email + телефон)
     // Возвращает объект с ошибками - удобно для отображения на форме
    public validateStep2(): Step2Errors {
        const errors: Step2Errors = {};
        if (!this.email || !this.email.trim()) errors.email = "Укажите email";
        if (!this.phone || !this.phone.trim()) errors.phone = "Укажите телефон" ;
        return errors;
    }

    // Получить все данные покупателя в виде объекта
    public getData() {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }
}