'use strict';
import ApiSettings from "./ApiSettings.js";
import { TIMEOUT_API_CALL } from "./utils/constants.js"; 
import { EMAIL_REG } from "./utils/regex.js";
import { MASK_PHONE } from "./utils/mask.js";


/** 
 * Константа описывающая правила по входным данным для полей формы
 * @type { { nameLength: number, emailReg: string, phoneReg: number } } 
 */
export const validationRules = {
    nameLength: 2,
    emailReg: EMAIL_REG,
    phoneReg: 17
}

/** 
 * Функция проверки объекта на наличие значения
 * 
 * @param {object} obj объект для проверки
 * @returns {boolean} значение bool обозначающее наличие или отсутствие содержимого в объекте
 */
export const isEmptyObject = (obj) =>
    Object.keys(obj).length === 0;

/** 
 * Функция добавления события на элемент DOM.
 * 
 * @param {object} elem объект DOM для привязки события
 * @param {object} func функция срабатывающая при исполнении события
 * @param {object} event объект события
 * 
 */
export const addListener = (elem, func, event) => {
    if (elem.clickHandler) {
        elem.removeEventListener(event, elem.clickHandler);
    }

    elem.addEventListener(event, func);
}

/** 
 * Функция изменения стиля стрелки(изображения) на элементах, меняет класс на обратный.
 * 
 * @param {object} elem объект DOM для изменения класса
 * 
 */
const resetArrowImg = (elem) => {
    if (elem.classList.contains('select-wrapper__input--down')) {
        elem.classList.add('select-wrapper__input--up');
        elem.classList.remove('select-wrapper__input--down');
    } else {
        elem.classList.remove('select-wrapper__input--up');
        elem.classList.add('select-wrapper__input--down');
    }
}

/** 
* Функция валидации поля формы обратной связи.
* 
* @param {object} wrapper элемент DOM для проверки условий
* @param {object} message объект содержащий данные для заполнения из полей формы

* @returns {boolean} значение bool обозначающее выполнение или невыполнение условий проверки валидации поля
*/
const validation = (wrapper, message) => {
    if (wrapper !== null) {

        if (wrapper.getAttribute('name') === 'name') {
            if (wrapper.value.length <= validationRules.nameLength) {
                return false;
            } else {
                message.name = wrapper.value;
                return true;
            }
        }

        if (wrapper.getAttribute('name') === 'email') {
            if (!wrapper.value.match(validationRules.emailReg)) {
                return false;
            } else {
                message.email = wrapper.value;
                return true;
            }
        }

        if (wrapper.getAttribute('name') === 'phoneNumber') {
            if (wrapper.value.length != validationRules.phoneReg) {
                return false;
            } else {
                message.phoneNumber = wrapper.value;
                return true;
            }
        } else {
            message.comment = wrapper.value;
            return true;
        }
    }
}

/** 
 * Функция проверки полей формы.
 * 
 * @param {object} message объект содержащий данные для заполнения из полей формы
 * @param {object} formWrappers элементы DOM формы
 * 
 * @returns {boolean} значение bool обозначающее выполнение или невыполнение условий проверки валидации полей
 */
const submitForm = (message, formWrappers) => {
    let returnValue = true;

    for (const selectWrapper of formWrappers) {
        const filterButton = selectWrapper.querySelector('.select-wrapper__input');

        if (!validation(filterButton, message)) {
            returnValue = false;
            break;
        }
    }

    return returnValue;
}

/** 
 * Функция проверки и корректировки формата ввода поля мобильного телефона.
 * 
 * @param {object} selector объект привязки событий
 * @param {string} masked формат маски ввода телефона, по умолчанию +7 (___) ___-__-__
 * 
 * @returns {boolean} значение bool обозначающее выполнение или невыполнение условий проверки валидации полей
 */
const maskPhone = (selector) => {
    const elem = selector;
    const masked = MASK_PHONE;

	function mask(event) {
        const keyCode = event.keyCode;
		const template = masked,
            def = template.replace(/\D/g, ""),
            val = this?.value?.replace(/\D/g, "");
        
        let i = 0,
            newValue = template.replace(/[_\d]/g, (a) => {
                return i < val?.length ? val?.charAt(i++) || def?.charAt(i) : a;
            });
        
        i = newValue?.indexOf("_");
        
        if (i !== -1) {
            newValue = newValue.slice(0, i);
        }

        let reg = template.substr(0, this?.value?.length).replace(/_+/g,
            (a) => {
                return "\\d{1," + a.length + "}";
            }).replace(/[+()]/g, "\\$&");

        reg = new RegExp("^" + reg + "$");

        if (!reg.test(this?.value) || this?.value.length < 5 || keyCode > 47 && keyCode < 58) {
            this.value = newValue;
        }

        if (event.type === "blur" && this?.value.length < 5) {
            this.value = "";
        }
    }

    elem.addEventListener("input", mask);
    elem.addEventListener("focus", mask);
    elem.addEventListener("blur", mask);

}

/** 
 * Функция события открытия детальной информации описания карточки вакансии.
 * 
 * @param {object} cardButton объект DOM кнопки открытия детальной информации описания карточки вакансии
 */
export const onDetailsDescriptionClick = (card) => (event) => {
    const cardButton = card.querySelector('.card__details-button');
    const cardDetails = card.querySelector('.card__details');

    card.querySelector('.card__description-footer').classList.toggle('card__description-footer--hide');
    card.querySelector('.card__description').classList.toggle('card__description--full');

    if (cardButton.innerText === 'More details') {
        cardButton.innerHTML = 'Less details';
        cardDetails.classList.add('card__details--up');
        cardDetails.classList.remove('card__details--down');
    } else {
        cardButton.innerHTML = 'More details';
        cardDetails.classList.remove('card__details--up');
        cardDetails.classList.add('card__details--down');
    }
}

/** 
 * Функция события открытия детальной информации описания карточки вакансии.
 * Для корректной работы событие может срабатывать не чаще чем раз в ~4 секунды.
 * 
 * @param {object} cardData объект содержащий параметры работы с API загрузки карточек
 * @param {object} loadCardButton объект DOM кнопки загрузки карточек
 */
const onLoadCardsClick = (cardData, loadCardButton) => (event) => {
    if (cardData.getIndexPage() * cardData.getNumCardInPage() >= cardData.getMaxCardLoading()) {
        document.querySelector('.card-block__load-card').classList.add('card-block__load-card--hide');
        cardData.indexPageReset();
        document.querySelector('.card-block__load-card').classList.add('visually-hidden');
    } else {
        let params = {};
        loadCardButton.disabled = true;

        loadCardDataWithParams(params, cardData);

        setTimeout(() => {
            loadCardButton.disabled = false;
        }, TIMEOUT_API_CALL);
    }
}

/** 
 * Функция события загрузки карточки с заданными параметрами фильтрации запроса к API.
 * 
 * @param {object} params параметры фильтрации для запроса к API загрузки карточек вакансий
 * @param {object} cardData объект содержащий параметры работы с API загрузки карточек
 */
const loadCardDataWithParams = (params, cardData) => {
    const paramsList = document.querySelectorAll('.filter');

    for (const param of paramsList) {
        const paramValue = param.getAttribute('data-eventual');

        if (paramValue !== 'NotSelected') {
            params[param.getAttribute('data-key')] = paramValue;
        }
    }

    cardData.clearCards();
    cardData.loadCardData(params);
}

/** 
 * Функция события загрузки вакансий по заданным параметрам фильтрации.
 * Для корректной работы событие может срабатывать не чаще чем раз в ~4 секунды.
 * 
 * @param {object} cardData объект содержащий параметры работы с API загрузки карточек
 * @param {object} loadCardButton объект DOM кнопки загрузки карточек
 */
const onFilterCardLoadClick = (cardData, loadCardButton) => (event) => {
    const paramsList = document.querySelectorAll('.filter');
    let params = {};

    cardData.indexPageReset();
    document.querySelector('.card-block__load-card').classList.remove('visually-hidden');

    for (const param of paramsList) {
        param.setAttribute('data-eventual', param.getAttribute('data-preliminary'));
    }

    document.querySelector('.card-block__list').innerText = '';
    loadCardButton.disabled = true;
    loadCardDataWithParams(params, cardData);

    setTimeout(() => {
        loadCardButton.disabled = false;
    }, TIMEOUT_API_CALL);
}

/** 
 * Функция события сброса фильтров и загрузки карточек по умолчанию.
 * 
 * @param {object} cardData объект содержащий параметры работы с API загрузки карточек
 */
const onFilterCardClearClick = (cardData) => (event) => {
    const paramsList = document.querySelectorAll('.filter');

    cardData.indexPageReset();

    document.querySelector('.card-block__load-card').classList.remove('visually-hidden');

    for (const param of paramsList) {
        param.setAttribute('data-eventual', 'NotSelected');
        param.setAttribute('data-preliminary', 'NotSelected');
        param.innerText = 'Not selected';
        param.classList.remove('select-wrapper__input--selected');
    }

    document.querySelector('.card-block__list').innerText = '';
    document.querySelector('.filters__clear-filters').classList.add('filters__clear-filters--hide');
    loadCardDataWithParams({}, cardData);
}

/** 
 * Функция события переключения видимости выпадающего списка вариантов фильтрации.
 * 
 * @param {object} selectList объект DOM выпадающего списка вариантов фильтрации запроса к API
 * @param {object} filterButton объект DOM кнопки выбора фильтрации
 */
const onFilterOptionClick = (selectList, filterButton) => (event) => {
    selectList.classList.toggle('select-wrapper__list--visible');
    filterButton.blur();
}

/** 
 * Функция события переключения стрелок(изображений) на кнопках.
 * 
 * @param {object} filter объект DOM кнопки фильтра на котором сработало событие
 * @param {object} listFilters объекты DOM других(всех кроме нажатой) кнопок выбора фильтрации
 */
const onFilterResetArrowClick = (filter, listFilters) => (event) => {
    if (filter.classList.contains('select-wrapper__input--up')) {
        resetArrowImg(filter);

        Object.entries(listFilters).filter(currentFilter => filter !== currentFilter[1])
            .forEach(currentFilter => {
                currentFilter?.classList.remove('select-wrapper__input--up');
                currentFilter?.classList.add('select-wrapper__input--down');
            });

    } else {
        resetArrowImg(filter);
    }
}

/** 
 * Функция события выбора параметра фильтрации из выпадающего списка. Задает кнопке фильтрации выбранный текст из
 * выпадающего списка и задает атрибуты для последующей отправки запроса к API с фильтрацией.
 * 
 * @param {object} selectList объект DOM выпадающего списка вариантов фильтрации запроса к API
 * @param {object} filterButton объект DOM кнопки выбора фильтрации
 * @param {object} item объект DOM выбранного пункта(параметра) фильтрации
 */
const onSelectListItemClick = (selectList, filterButton, item) => (event) => {
    event.stopPropagation();
    filterButton.innerText = item.innerText;
    filterButton.setAttribute('data-eventual', 'NotSelected');
    filterButton.setAttribute('data-Preliminary', item.getAttribute('data-value'));
    filterButton.blur();
    filterButton.classList.add('select-wrapper__input--selected');
    filterButton.classList.remove('select-wrapper__input--up');
    filterButton.classList.add('select-wrapper__input--down');
    selectList.classList.remove('select-wrapper__list--visible');
    document.querySelector('.filters__clear-filters').classList.remove('filters__clear-filters--hide');
}

/** 
 * Функция события сокрытия выпадающего списка параметров фильтрации.
 * 
 * @param {object} selectList объект DOM выпадающего списка вариантов фильтрации запроса к API
 * @param {object} filterButton объект DOM кнопки выбора фильтрации
 */
const onListItemsHideClick = (selectList, filterButton) => (event) => {
    if (event.target !== filterButton) {
        selectList.classList.remove('select-wrapper__list--visible');
        filterButton.classList.add('select-wrapper__input--active');
        filterButton.classList.remove('select-wrapper__input--up');
        filterButton.classList.add('select-wrapper__input--down');
    }
}

/** 
 * Функция события скрытия выпадающего списка посредством нажатия кнопок TAB и Escape.
 * 
 * @param {object} selectList объект DOM выпадающего списка вариантов фильтрации запроса к API
 * @param {object} filterButton объект DOM кнопки выбора фильтрации
 */
const onListItemsHideKeydown = (selectList, filterButton) => (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
        selectList.classList.remove('select-wrapper__list--visible');
        filterButton.classList.remove('select-wrapper__input--up');
        filterButton.classList.add('select-wrapper__input--down');
    }
}

/** 
 * Функция привязки событий к элементам фильтрации.
 * 
 * @param {object} wrappers объекты DOM выпадающего списка вариантов фильтрации запроса к API
 */
const filterDataEvents = (wrappers) => {
    if (wrappers !== null) {
        for (const selectWrapper of wrappers) {
            const filterButton = selectWrapper.querySelector('.select-wrapper__input');

            if (filterButton !== null) {
                const selectList = selectWrapper.querySelector('.select-wrapper__list');
                const selectListItem = selectList.querySelectorAll('.select-wrapper__list-item');

                addListener(filterButton, onFilterOptionClick(selectList, filterButton), 'click');

                for (const item of selectListItem) {
                    addListener(item, onSelectListItemClick(selectList, filterButton, item), 'click');
                }

                addListener(document, onListItemsHideClick(selectList, filterButton), 'click');
                addListener(document, onListItemsHideKeydown(selectList, filterButton), 'keydown');
            }
        }
    }
}

/** 
 * Функция проверки и вывода данных из формы.
 * 
 * @param {object} form объект DOM формы
 * @param {object} formWrappers элемент DOM формы
 */
const onFormSubmit = (form, formWrappers) => (event) => {
    const message = {
        name: '',
        email: '',
        phoneNumber: '',
        comment: '',
    };

    if (form !== null) {
        if (!submitForm(message, formWrappers)) {
            event.preventDefault();
            return false;
        }
    }

    alert('Sent name: ' + message.name + '\nSent email: ' + message.email + '\nSent phone: ' + message.phoneNumber + '\nSent comment: ' + message.comment);

}

/** 
* Функция привязки событий на страницу.

* @param {object} cardData объект содержащий параметры работы с API загрузки карточек
*/
const addEvents = (cardData) => {
    const loadCardButton = document.querySelector('.card-block__load-card');
    const filterCards = document.querySelector('.filters__search');
    const filtersClear = document.querySelector('.filters__clear-filters-input');
    const wrappers = document.querySelectorAll('.filters__label');
    const filters = document.querySelectorAll('.filter');
    const phone = document.querySelector('.inputPhone');
    const form = document.querySelector('.request-block__form');
    const formWrappers = document.querySelectorAll('.form__label');

    addListener(loadCardButton, onLoadCardsClick(cardData, loadCardButton), 'click');
    addListener(filterCards, onFilterCardLoadClick(cardData, filterCards), 'click');
    addListener(filtersClear, onFilterCardClearClick(cardData), 'click');
    filterDataEvents(wrappers);

    for (const filter of filters) {
        addListener(filter, onFilterResetArrowClick(filter, filters), 'click');
    }

    maskPhone(phone);
    addListener(form, onFormSubmit(form, formWrappers), 'submit');
}

window.onload = () => {
    const cardData = new ApiSettings();

    cardData.loadCardData();
    addEvents(cardData);
};