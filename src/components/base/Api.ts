
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    constructor(
        protected baseUrl: string,
        protected options: RequestInit = {}
    ) {}

    protected handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            return Promise.reject(`Ошибка: ${response.status}`);
        }
        return response.json() as Promise<T>;
    }

    public get<T>(uri: string): Promise<T> {
        return fetch(`${this.baseUrl}${uri}`, {
            ...this.options,
            method: 'GET',
        }).then(res => this.handleResponse<T>(res));
    }

    public post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(`${this.baseUrl}${uri}`, {
            ...this.options,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(typeof this.options.headers === 'object' ? this.options.headers : {}),
            },
            body: JSON.stringify(data),
        }).then(res => this.handleResponse<T>(res));
    }
}
