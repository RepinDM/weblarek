
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    constructor(
        protected baseUrl: string,
        protected options: RequestInit = {}
    ) {}

    protected handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
        return Promise.reject(`Ошибка: ${response.status}`);
        }
        return response.json();
    }

    public get(uri: string): Promise<any> {
        return fetch(`${this.baseUrl}${uri}`, {
        ...this.options,
        method: 'GET',
        }).then(this.handleResponse);
    }

    public post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<any> {
        return fetch(`${this.baseUrl}${uri}`, {
        ...this.options,
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(this.options && (this.options as any).headers),
        },
        body: JSON.stringify(data),
        }).then(this.handleResponse);
    }
}
