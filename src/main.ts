import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiService } from './components/Communication/ApiService';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { Product } from './components/Models/Product';
import { BasketView } from './components/views/Basket';
import { GalleryView } from './components/views/Gallery';
import { HeaderView } from './components/views/Header';
import { ModalView } from './components/views/Modals';
import { CardBasket } from './components/views/ReusableEntities/CardItems/CardBasket';
import { CardCatalog } from './components/views/ReusableEntities/CardItems/CardCatalog';
import { CardPreview } from './components/views/ReusableEntities/CardItems/CardPreview';
import { ContactForm } from './components/views/ReusableEntities/Forms/ContactForm';
import { OrderForm } from './components/views/ReusableEntities/Forms/OrderForm';
import { SuccessView } from './components/views/Success';
import './scss/styles.scss';
import { IBuyer, IProduct, TPayment } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


const events = new EventEmitter();
const cardCatalog = new Product(events);
const basketModel = new Basket(events);
const customerModel = new Customer(events);

const api = new Api(API_URL);
const apiService = new ApiService(CDN_URL, api);

const gallery = new GalleryView(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new ModalView(ensureElement<HTMLElement>('.modal'), events);
const header = new HeaderView(ensureElement<HTMLElement>('.header'), events);

const BUTTON_CONFIG = {
    UNAVAILABLE: { text: 'Недоступно', disabled: true },
    IN_BASKET: { text: 'Удалить из корзины', disabled: false },
    AVAILABLE: { text: 'В корзину', disabled: false }
} as const;

const getButtonConfiguration = (item: IProduct, isInBasket: boolean) => {
    if (item.price === null) return BUTTON_CONFIG.UNAVAILABLE;
    if (isInBasket) return BUTTON_CONFIG.IN_BASKET;
    return BUTTON_CONFIG.AVAILABLE;
};

events.on('card:selected', (item: IProduct) => {
    cardCatalog.setSelectedItem(item);
    const isInBasket = basketModel.inBasket(item.id);
    const buttonConfig = getButtonConfiguration(item, isInBasket);

    const card = new CardPreview(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')), {
        onClick: () => {
            const eventType = isInBasket ? 'card:remove' : 'card:add';
            events.emit(eventType, item);
            modal.close();
        }
    });

    const cardData = {
        ...item,
        buttonText: buttonConfig.text,
        buttonLocked: buttonConfig.disabled
    };
    
    const renderedCard = card.render(cardData);
    modal.setContent(renderedCard);
    modal.open();
})

events.on('card:add', (item: IProduct) => {
    basketModel.addItem(item);
    console.log('Товар добавлен в корзину:', item.title);
});

events.on('card:remove', (item: IProduct) => {
    basketModel.removeItem(item);
    console.log('Товар удален из корзины:', item.title);
});

function renderBasket(): HTMLElement {
    const basketItems = basketModel.getBasketItems()
        .map((item, index) => {
            return new CardBasket(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')), {
                onDelete: () => events.emit('card:remove', item)
            }).render({
                title: item.title,
                price: item.price,
                index: index + 1
            })
        });

    const basket = new BasketView(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), {
        onBuy: () => events.emit('basket:order')
    });

    basket.items = basketItems;
    basket.total = basketModel.getTotalPrice();

    return basket.render();

}

events.on('basket:open', () => {
    modal.setContent(renderBasket());
    modal.open();
})

events.on('basket:changed', () => {
    header.counter = basketModel.getItemsAmount();
    if (modal.isModalOpen()) {
        modal.setContent(renderBasket());
    }
})

events.on('basket:order', () => {
    const customerInfo = customerModel.getCustomerInfo();

    currentFormOrder = new OrderForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), {
        onSubmit: (event: Event) => {
            event.preventDefault();
            const orderData = currentFormOrder!.itemsOrderData;
            const errors = customerModel.validationOrderInfo();

            if (Object.keys(errors).length === 0) {
                customerModel.setCustomerInfo(orderData);
                events.emit('order:submit', orderData);
                console.log('Данные доставки сохранены:', orderData);
            } else {
                currentFormOrder!.setValidationError(errors);
            }
        },
        onPaymentChange: (payment: TPayment) => {
            customerModel.setField('payment', payment);
        },
        onAddressChange: (address: string) => {
            customerModel.setField('address', address);
        },
    });

    currentFormOrder.payment = customerInfo.payment || 'card';
    currentFormOrder.address = customerInfo.address;

    modal.setContent(currentFormOrder.render());
    modal.open();
});

let currentFormOrder: OrderForm | null = null;
let currentFormContacts: ContactForm | null = null;

events.on('buyer:changed', () => {
    if (currentFormOrder) {
        const orderValidationErrors = customerModel.validationOrderInfo();
        currentFormOrder.setValidationError(orderValidationErrors);
    }
    if (currentFormContacts) {
        const contactsValidationErrors = customerModel.validationContactsInfo();
        currentFormContacts.setValidationError(contactsValidationErrors);
    }
});


events.on('order:submit', (orderData: Pick<IBuyer, 'payment' | 'address'>) => {
    customerModel.setCustomerInfo(orderData);

    currentFormContacts = new ContactForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), {
        onSubmit: (event: Event) => {
            event.preventDefault();
            const formData = currentFormContacts!.itemsContactData;

            const fullOrderData: IBuyer = {
                ...orderData,
                ...formData
            };

            customerModel.setCustomerInfo(fullOrderData);
            
            events.emit('contacts:submit', fullOrderData);
            console.log('[contacts:submit]', fullOrderData);
        },
        onEmailChange: (email: string) => {
            customerModel.setField('email', email);
        },
        onPhoneChange: (phone: string) => {
            customerModel.setField('phone', phone);
        },
    });

    const currentInfo = customerModel.getCustomerInfo();
    currentFormContacts.email = currentInfo.email;
    currentFormContacts.phone = currentInfo.phone;

    modal.setContent(currentFormContacts.render());
    modal.open();
});

events.on('modal:close', () => { 
    currentFormOrder = null;
    currentFormContacts = null;
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
    const customerInfo = customerModel.getCustomerInfo();
    
    const orderData = {
        payment: customerInfo.payment,
        email: data.email,
        phone: data.phone,
        address: customerInfo.address,
        total: basketModel.getTotalPrice(),
        items: basketModel.getBasketItems().map(item => item.id),
    };
    
    console.log('Данные заказа:', orderData);
    
    api.post<{id: string; total: number}>('/order', orderData)
        .then(res => {
            const orderSuccess = new SuccessView(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
                onClose: () => {
                    modal.close();
                    basketModel.clearItems();
                    customerModel.clearCustomerInfo();
                    console.log('Заказ:', res);
                },
            });

            orderSuccess.render({ total: res.total });
            modal.setContent(orderSuccess.render());
            modal.open();
        })
        .catch(error => console.log('Ошибка оформления заказа:', error));
});

events.on('catalog:changed', () => {
    const items = cardCatalog.getItems().map(item => {
        const cards = new CardCatalog(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')), {
            onClick: () => {
                events.emit('card:selected', item);
            },
        });
        return cards.render(item);
    })
    gallery.render({catalog: items});
})

apiService.getItemsList()
    .then(response => cardCatalog.setItems(response.items))
    .catch(error => console.log('Ошибка загрузки с сервера', error));

