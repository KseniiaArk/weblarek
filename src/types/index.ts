import { ProductCategory } from "../utils/constants";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    price: number | null;
    category: ProductCategory;
}

export type TPayment = 'cash' | 'card' | '';

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IItemListResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export type IOrderRequest = IBuyer & {
    items: string[];
    total: number;
}

export interface ISuccession {
    onClose?: () => void;
}

export interface IBuy {
    onBuy?: () => void;
}

export interface ICatalogClick {
    onClick?: (evt: MouseEvent) => void;
}

export interface IDeleteFromBasket {
    onDelete?: (evt: MouseEvent) => void;
}

export interface IFormSubmit {
    onSubmit?: (evt: Event) => void;
}