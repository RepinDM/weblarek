import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";
import type { TPayment } from "../../types";

export class BuyerModel {
    private payment: TPayment | "" = "";
    private address: string = "";
    private email: string = "";
    private phone: string = "";

    constructor(private events?: IEvents) {}

    setPayment(method: TPayment | ""): void {
        this.payment = method;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setAddress(address: string): void {
        this.address = address;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setEmail(email: string): void {
        this.email = email;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    getPayment(): TPayment | "" { return this.payment; }
    getAddress(): string { return this.address; }
    getEmail(): string { return this.email; }
    getPhone(): string { return this.phone; }

    reset(): void {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.events?.emit(EVENTS.BUYER_CHANGED);
    }

    validateStep1(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.payment) errors.payment = "Выберите способ оплаты";
        if (!this.address) errors.address = "Введите адрес доставки";
        return errors;
    }

    validateStep2(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.email) errors.email = "Введите email";
        if (!this.phone) errors.phone = "Введите телефон";
        return errors;
    }
    }
