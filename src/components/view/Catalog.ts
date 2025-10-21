
import { Component } from "../base/Component";

/**
 * Catalog — простой контейнер. Принимает массив HTMLElement в render.
 * render signature соответствует Component: render(data?: Partial<T>)
 */
export class Catalog extends Component<HTMLElement[]> {
    constructor(container: HTMLElement) {
    super(container);
    }

    render(data?: Partial<HTMLElement[]>): HTMLElement {
    const elements = (data as HTMLElement[] | undefined) ?? [];
    this.container.innerHTML = '';
    elements.forEach(el => this.container.appendChild(el));
    return this.container;
    }
}
