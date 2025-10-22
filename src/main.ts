import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiService } from './components/Communication/ApiService';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { Products } from './components/Models/Product';
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

// шаблоны
const basketTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#basket'));
const cardBasketTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket'));
const cardPreviewTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview'));
const cardCatalogTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog'));
const orderTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#order'));
const contactsTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts'));
const successTemplate = cloneTemplate(ensureElement<HTMLTemplateElement>('#success'));

// модели и сервисы
const events = new EventEmitter();
const cardCatalog = new Products(events);
const basketModel = new Basket(events);
const customerModel = new Customer(events);

const api = new Api(API_URL);
const apiService = new ApiService(CDN_URL, api);

// представления создаются один раз
const gallery = new GalleryView(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new ModalView(ensureElement<HTMLElement>('.modal'), events);
const header = new HeaderView(ensureElement<HTMLElement>('.header'), events);

const orderForm = new OrderForm(orderTemplate, {
    onSubmit: (event: Event) => {
        event.preventDefault();
        events.emit('order:submit');
    }, 
    onPaymentChange: (payment: TPayment) => {
        events.emit('buyer:change', {field: 'payment', value: payment});
    },
    onAddressChange: (address: string) => {
        events.emit('buyer:change', {field: 'address', value: address});
    },
});

const contactForm = new ContactForm(contactsTemplate, {
    onSubmit: (event: Event) => {
        event.preventDefault();
        events.emit('contacts:submit');
    },
    onPhoneChange: (phone: string) => {
        events.emit('buyer:change', {field: 'phone', value: phone});
    },
    onEmailChange: (email: string) => {
        events.emit('buyer:change', {field: 'email', value: email});
    },
})

const successView = new SuccessView(successTemplate, {
    onClose: () => modal.close()
})

const basketView = new BasketView(basketTemplate, {
        onBuy: () => events.emit('basket:order')
});

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

let activeForm: 'order' | 'contacts' | null = null;


events.on('product:selected', (item: IProduct) => {
    const isInBasket = basketModel.inBasket(item.id);
    const buttonConfig = getButtonConfiguration(item, isInBasket);

    const card = new CardPreview(cardPreviewTemplate.cloneNode(true) as HTMLElement, {
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

function renderBasket(): void {
    const basketItems = basketModel.getBasketItems()
        .map((item, index) => {
            return new CardBasket(cardBasketTemplate.cloneNode(true) as HTMLElement, {
                onDelete: () => events.emit('card:remove', item)
            }).render({
                title: item.title,
                price: item.price,
                index: index + 1
            })
        });

    basketView.items = basketItems;
    basketView.total = basketModel.getTotalPrice();
    basketView.buttonDisabled = basketItems.length === 0;
}

events.on('basket:open', () => {
    modal.setContent(basketView.render());
    modal.open();
})

events.on('basket:changed', () => {
    header.counter = basketModel.getItemsAmount();
    renderBasket();

    if (modal.isModalOpen() && activeForm === null) {
        modal.setContent(basketView.render());
    }
})

events.on('basket:order', () => {
    activeForm = 'order';
    const customerInfo = customerModel.getCustomerInfo();
    orderForm.payment = customerInfo.payment;
    orderForm.address = customerInfo.address;

    const errors = customerModel.validationOrderInfo();
    orderForm.setValidationError(errors);
    orderForm.valid = Object.keys(errors).length === 0;

    modal.setContent(orderForm.render());
    modal.open();
});

events.on('buyer:change', (data: {field: keyof IBuyer; value: string}) => {
    customerModel.setField(data.field, data.value as any);
});

events.on('form:validate', (errors: Record<string, string>) => {
    if (activeForm === 'order') {
        const orderErrors = {
            payment: errors.payment || '',
            address: errors.address || ''
        };
        orderForm.setValidationError(orderErrors);
        orderForm.valid = Object.keys(errors).length === 0;
        
    } else if (activeForm === 'contacts') {
        const contactErrors = {
            email: errors.email || '',
            phone: errors.phone || ''
        };
        contactForm.setValidationError(contactErrors);
        contactForm.valid = Object.keys(errors).length === 0;
    }
})

events.on('order:submit', () => {
    activeForm = 'contacts';
    const currentInfo = customerModel.getCustomerInfo();
    contactForm.email = currentInfo.email;
    contactForm.phone = currentInfo.phone;
    
    const contactErrors = customerModel.validationContactsInfo();
    contactForm.setValidationError(contactErrors);
    contactForm.valid = Object.keys(contactErrors).length === 0;

    modal.setContent(contactForm.render());
});

events.on('modal:close', () => { 
    activeForm = null;
});

events.on('contacts:submit', () => {
    const errors = customerModel.validationContactsInfo();

    if (Object.keys(errors).length === 0) {
        const customerInfo = customerModel.getCustomerInfo();
        const orderData = {
            ...customerInfo,
            total: basketModel.getTotalPrice(),
            items: basketModel.getBasketItems().map(item => item.id),
        };


         apiService.postOrder(orderData)
            .then(res => {
                basketModel.clearItems();
                customerModel.clearCustomerInfo();

                successView.total = res.total;
                modal.setContent(successView.render());
                modal.open();
            })
            .catch(error => console.log('Ошибка оформления заказа:', error));
    } else {
        contactForm.setValidationError(errors);
    }
});

events.on('catalog:changed', () => {
    const items = cardCatalog.getItems().map(item => {
        const cards = new CardCatalog(cardCatalogTemplate.cloneNode(true) as HTMLElement, {
            onClick: () => {
                cardCatalog.setSelectedItem(item);
            },
        });
        return cards.render(item);
    })
    gallery.render({catalog: items});
})

apiService.getItemsList()
    .then(response => cardCatalog.setItems(response.items))
    .catch(error => console.log('Ошибка загрузки с сервера', error));
