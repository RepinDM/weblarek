import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class BuyerModel {
    private payment: "card" | "cash" | "" = "";
    private address: string = "";
    private email: string = "";
    private phone: string = "";

    constructor(private events?: IEvents) {}

    setPayment(method: "card" | "cash" | "") {
        this.payment = method;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setAddress(address: string) {
        this.address = address;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setEmail(email: string) {
        this.email = email;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setPhone(phone: string) {
        this.phone = phone;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    getPayment() { return this.payment; }
    getAddress() { return this.address; }
    getEmail() { return this.email; }
    getPhone() { return this.phone; }

    reset() {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    validateStep1() {
        const errors: Record<string, string> = {};
        if (!this.payment) errors.payment = "Выберите способ оплаты";
        if (!this.address) errors.address = "Введите адрес доставки";
        return errors;
    }

    validateStep2() {
        const errors: Record<string, string> = {};
        if (!this.email) errors.email = "Введите email";
        if (!this.phone) errors.phone = "Введите телефон";
        return errors;
    }
    }
