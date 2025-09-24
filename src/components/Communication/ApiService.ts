import { IApi, IItemListResponse, IOrderRequest, IOrderResponse } from "../../types";

export class ApiService {
    constructor(private api: IApi) {}

    getItemsList(): Promise<IItemListResponse> {
        return this.api.get<IItemListResponse>('/product');
    }

    postOrder(evt: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', evt);
    }
}