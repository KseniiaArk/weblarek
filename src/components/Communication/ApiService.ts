import { IApi, IItemListResponse, IOrderRequest, IOrderResponse } from "../../types";

export class ApiService {
    readonly baseUrl: string;
    protected api: IApi;

    constructor(baseUrl: string, api: IApi) {
        this.baseUrl = baseUrl;
        this.api = api;
    }

    getItemsList(): Promise<IItemListResponse> {
        return this.api.get<IItemListResponse>('/product').then(data => ({
            total: data.total,
            items: data.items.map(item => ({
                ...item,
                image: this.baseUrl + item.image
            }))
        }));
    }

    postOrder(evt: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', evt).then(data => data);
    }
}