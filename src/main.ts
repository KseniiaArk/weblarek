import { Api } from './components/base/Api';
import { ApiService } from './components/Communication/ApiService';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { Product } from './components/Models/Product';
import './scss/styles.scss';
import { IBuyer, IItemListResponse, IProduct } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// проверка работы каталога товаров
const cardCatalog = new Product();
cardCatalog.setItems(apiProducts.items as IProduct[]); 
console.log('Массив товаров из каталога: ', cardCatalog.getItems());
const firstItem = cardCatalog.getItem('854cef69-976d-4c2a-a18c-2aa45046c390');
const seconfItem = cardCatalog.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
cardCatalog.setSelectedItem(firstItem);
console.log('Выбранный айтем: ', cardCatalog.getSelectedItem());

// проверка функций из корзины
const basket = new Basket();
basket.addItem(firstItem);
basket.addItem(seconfItem);
console.log('В корзине находятся: ', basket.getBasketItems());
console.log('Есть ли в корзине первый айтем: ', basket.inBasket('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Количество товаров в корзине: ', basket.getItemsAmount());
console.log('Стоимость товаров в корзине: ', basket.getTotalPrice());
basket.removeItem(seconfItem);
console.log('В корзине находятся: ', basket.getBasketItems());
basket.clearItems();
console.log('В корзине после очистки находятся: ', basket.getBasketItems());

// проверка класса покупателя
const customer = new Customer();
const newCustomer: IBuyer = {
    'payment': 'cash',
    'email': 'newCustomer@yandex.ru',
    'phone': '',
    'address': 'dom Pushkina ul Kolotushkina'
};
customer.setCustomerInfo(newCustomer);
console.log('Проверим информацию: ', customer.validationCustomerInfo());
console.log('Полученные данные о заказчике: ', customer.getCustomerInfo());
customer.clearCustomerInfo();
console.log('Полученные данные о заказчике: ', customer.getCustomerInfo());

const api = new Api(API_URL);
const apiService = new ApiService(api);
apiService.getItemsList()
    .then((response: IItemListResponse) => {
        console.log('Данные получены с сервера:');
        console.log('Общее количество товаров:', response.total);
        console.log('Полученные товары:', response.items);

        cardCatalog.setItems(response.items);

        console.log('Каталог обновлен данными с сервера');
        console.log('Товары в каталоге', cardCatalog.getItems());
        console.log('Количество товаров в каталоге:', cardCatalog.getItems().length);

        if (response.items.length > 0) {
            const serverItem = cardCatalog.getItem(response.items[0].id);
            console.log('Первый товар из каталога', serverItem);
        }
    })
    .catch(error => console.log('Ошибка загрузки с сервера', error));
    
