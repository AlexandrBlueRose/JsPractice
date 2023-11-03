'use strict';

/** 
 * Константа описывающая правила по входным данным для полей формы
 * @type { { nameLength: number, emailReg: string, phoneReg: number } } 
 */
const validationRules = {
    nameLength: 2,
    emailReg: /^.+@[^\.].*\.[a-z]{2,}$/,
    phoneReg: 17
}

/** 
 * Класс создающий новую карточки.
 * @class
 */
class Card {
    /** 
     * ID карточки. 
     * @type {number} 
     */
    #id;

    /** 
     * Название вакансии.
     * @type {string} 
     */
    #title;

    /** 
     * Описание вакансии.
     * @type {string} 
     */
    #description;

    /** 
     * Ссылка на лого работодателя разместившего вакансию.
     * @type {string} 
     */
    #logoUrl;

    /** 
     * Объект содержащий данные работодателя:
     * форму работы, название компании, сайт работодателя, адрес.
     * @type {object} 
     */
    #conditions;

    /** 
     * Параметр для сокрытия лого в случае отсутствия ссылки.
     * @type {string} 
     */
    #classOption = '';

    /**
     * Конструктор для создания карточки вакансии.
     * 
     * @constructor
     * @param {number} id - уникальный идентификатор карточки вакансии, по умолчанию 0.
     * @param {string} title - название вакансии, по умолчанию Not Selected.
     * @param {string} description - описание вакансии, по умолчанию Not Selected.
     * @param {string} logoUrl - ссылка на лого компании, по умолчанию пустая строка.
     * @param {object} conditions - Объект содержащий данные работодателя: форму работы, название компании, сайт работодателя, адрес. 
     * По умолчанию все параметры равны Not Selected.
     */
    constructor(id = 0, title = "Not Selected", description = "Not Selected", logoUrl = "",
        conditions = {
            form: "Not Selected",
            company: "Not Selected",
            web: "Not Selected",
            address: "Not Selected"
        }) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#logoUrl = logoUrl;
        this.#conditions = conditions;
    }

    /**
     * Возвращает значение ID.
     * @return {number} The ID value.
     */
    getId() {
        return this.#id;
    }

    /**
     * Возвращает значение title.
     * @return {string} The title value.
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Возвращает значение description.
     * @return {string} The description value.
     */
    getDescription() {
        return this.#description;
    }

    /**
     * Задает значение description.
     * @property {string} The description value.
     */
    setDescription(description) {
        this.#description = description;
    }


    /**
     * Возвращает значение logoUrl.
     * @return {string} The logoUrl value.
     */
    getLogoUrl() {
        return this.#logoUrl;
    }

    /**
     * Задает значение logoUrl.
     * @property {string} The logoUrl value.
     */
    setLogoUrl(logoUrl) {
        this.#logoUrl = logoUrl;
    }

    /**
     * Возвращает значение conditions.
     * @return {object} The conditions value.
     */
    getConditions() {
        return this.#conditions;
    }

    /**
     * Возвращает данные карточки для добавления на страницу.
     * @return {string} The card definition value.
     */
    cardDefinition() {
        if (!this.#logoUrl) {
            this.#classOption = 'visually-hidden';
        }
        return `
    <div class = "card card-block__item">
      <div class = "card__body">
        <div class = "card__title">
          <div class = "card__header-logo container-header-logo">
            <h3 class = "card__position-title">${this.#title}</h3>
            <img class = "card__logo ${this.#classOption}" src = "${this.#logoUrl}" alt = 'Company logo' height = "40px" width = "auto">
          </div>
          <button class = "card__respond-button">Respond</button>
        </div>
        <div class = "card__working-condition">
          <p class = "condition-gray card__form-working-time">
            Form
            <span class = "card__data-working-time">
              ${this.#conditions.form}
            </span>
          </p>
          <p class = "condition-gray card__company-name">
            Company
            <span class = "card__data-company-name">
              ${this.#conditions.company}
            </span>
          </p>
          <p class = "condition-gray card__website">
            Web
            <a class = "span card__data-website" href = "${this.#conditions.web}">
              ${this.#conditions.web}
            </a>
          </p>
          <p class = "condition-gray card__address">
          Address
            <span class = "card__data-address">
              ${this.#conditions.address}
            </span>
          </p> 
        </div>
        <div class = "card__description">
          ${this.#description}
          <div class = "card__description-footer">
          </div>
        </div>
        <div class = "card__details card__details--down">
          <button class = "link card__details-button" onClick = "detailsDescriptionEvent(this)">More details</button>
        </div>
      </div>
    </div>
    `;
    }

}

/** 
 * Класс описывающий настройки выгрузки карточек.
 * @class
 */
class ApiSettings {

    /** 
     * Набор карточек. 
     * @type {object} 
     */
    #cards;

    /** 
     * Количество карточек для загрузки. 
     * @type {number} 
     */
    #numCardInPage;

    /** 
     * Максимальное кол-во карточек доступных для загрузки, по умолчанию документация API загрузки карточек допускает 2000 объектов для выгрузки. 
     * @type {number} 
     */
    #maxCardLoading;

    /** 
     * Счетчик для подсчета количества выгруженных карточек, вычисляемых по формуле (indexPage * numCardInPage), 
     * произведение которых должно быть меньше заданной верхней границы в maxCardLoading. 
     * @type {number} 
     */
    #indexPage;


    /**
     * Конструктор для инициализации начальных настроек выгрузки карточек вакансий.
     * 
     * @constructor
     * @param {number} numCardInPage - кол-во карточек для загрузки в API, по умолчанию 5.
     * @param {string} maxCardLoading - максимальное кол-во карточек доступных для загрузки для сессии, по умолчанию 2000.
     * @param {string} cards - массив карточек, по умолчанию пустой массив.
     */
    constructor(numCardInPage = 5, maxCardLoading = 2000, cards = []) {
        this.#numCardInPage = numCardInPage;
        this.#maxCardLoading = maxCardLoading;
        this.#cards = cards;
        this.#indexPage = 1;
    }

    /**
     * Возвращает значение numCardInPage.
     * @return {number} The numCardInPage value.
     */
    getNumCardInPage() {
        return this.#numCardInPage;
    }

    /**
     * Возвращает значение maxCardLoading.
     * @return {number} The maxCardLoading value.
     */
    getMaxCardLoading() {
        return this.#maxCardLoading;
    }

    /**
     * Возвращает значение cards.
     * @return {object} The cards value.
     */
    getCards() {
        return this.#cards;
    }

    /**
     * Возвращает значение indexPage.
     * @return {number} The indexPage value.
     */
    getIndexPage() {
        return this.#indexPage;
    }

    /**
     * Увеличивает счетчик количества загруженных страниц карточек.
     */
    indexPageUp() {
        this.#indexPage++;
    }

    /**
     * Сбрасывает счетчик загруженных страниц карточек.
     */
    indexPageReset() {
        this.#indexPage = 1;
    }

    /**
     * Очищает массив карточек.
     */
    clearCards() {
        this.#cards = [];
    }

    /** 
     * Функция загрузки карточек. 
     * @param {object} параметры фильтрации для выгружаемых карточек.
     */
    loadCardData(params = {}) {
        if (this.getIndexPage() * this.getNumCardInPage() <= this.getMaxCardLoading()) {
            const cardHandler = new CardsHandler();

            cardHandler.cardAppendOnRoot(this.getCards(), this.getNumCardInPage(), this.getIndexPage(), params);
            this.indexPageUp();
        } else {
            document.querySelector('.card-block__load-card').classList.add('visually-hidden');
        }
    }
}

/** 
 * Класс логику взаимодействия с API загрузки карточек.
 * @class
 */
class CardsHandler {

    /** 
     * Функция загрузки карточек из API hh.ru, по запросу к API выгружается сразу множество карточек, без полного описания.
     * @async
     * 
     * @param {object} cards массив карточек, передается для заполнения
     * @param {number} perPage кол-во загружаемых на странице карточек, за один запрос к API
     * @param {number} page индекс страницы для загрузки карточек, с каждым запросом для загрузки новых карточек увеличивается
     * @param {number} params параметры запроса к API, описываю значение фильтрации посылаемые к API, по которому будут выбираться карточки 
     * @throws {Error}
     */
    async cardApiLoadData(cards, perPage, page, params = {}) {
        let param = '';

        if (isEmptyObject(params)) {
            params = '';
        } else {
            for (const [key, value] of Object.entries(params)) {
                param += key + value;
            }
        }
        try {
            const ApiSettings = await fetch(`https://api.hh.ru/vacancies?per_page=${perPage}&page=${page}${param}`);
            const cardsJson = await ApiSettings.json();

            for (const item of cardsJson.items.entries()) {
                await this.cardFullApiLoadData(item[1].id, cards);
            };
        } catch (err) {
            console.error(err);
        };
    }

    /** 
     * Функция загрузки карточки по заданному ID из API hh.ru, выгружаются все данные карточки, включая ее описание.
     * @async
     * 
     * @param {number} id уникальный идентификатора загружаемой из API каточки
     * @param {object} cards массив каточек для заполнения из API
     * @throws {Error}
     */
    async cardFullApiLoadData(id, cards) {
        try {
            const cardData = await fetch(`https://api.hh.ru/vacancies/${id}`);
            const cardsJson = await cardData.json();

            cards.push(this.cardCompletionAbstract(cardsJson));
        } catch (err) {
            console.error(err);
        };
    }

    /** 
     * Функция создает и заполняет новый объект класса Card.
     * 
     * @param {object} item данные полученные из API для заполнения карточки
     * @return {object} объект класса карточки Card
     */
    cardCompletionAbstract(item) {
        let card = new Card(item.id, item?.name, item?.description, item.employer?.logo_urls?.['240'], {
            form: item?.employment ? item.employment.name : "Not Selected",
            company: item?.employer?.name ? item.employer.name : "Not Selected",
            web: item?.employer?.alternate_url ? item.employer.alternate_url : "Not Selected",
            address: item?.area?.name ? item.area.name : "Not Selected"
        });
        return card;
    }

    /** 
     * Функция добавления карточки на страницу.
     * @async
     * 
     * @param {object} cards массив карточек для вставки
     * @param {number} perPage кол-во загружаемых на странице карточек, за один запрос к API
     * @param {number} page индекс страницы для загрузки карточек, с каждым запросом для загрузки новых карточек увеличивается
     * @param {number} params параметры запроса к API, описываю значение фильтрации посылаемые к API, по которому будут выбираться карточки 
     * @throws {Error}
     */
    async cardAppendOnRoot(cards, perPage, page, params = {}) {
        try {
            await this.cardApiLoadData(cards, perPage, page, params);

            if (cards.length < perPage) {
                document.querySelector('.card-block__load-card').classList.add('visually-hidden');
            }
            for (const card of cards) {
                document.querySelector('.card-block__list').insertAdjacentHTML('beforeend', card.cardDefinition());
            }
        } catch (err) {
            console.error(err);
        };
    }
}

/** 
 * Функция проверки объекта на наличие значения
 * 
 * @param {object} obj объект для проверки
 * @returns {boolean} значение bool обозначающее наличие или отсутствие содержимого в объекте
 */
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
}

/** 
 * Функция добавления события на элемент DOM.
 * 
 * @param {object} elem объект DOM для привязки события
 * @param {object} func функция срабатывающая при исполнении события
 * @param {object} event объект события
 * 
 */
const addListener = (elem, func, event) => {
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
        if (wrapper.getAttribute('name') == 'name') {
            if (wrapper.value.length <= validationRules.nameLength) {
                return false;
            } else {
                message.name = wrapper.value;
                return true;
            }
        }
        if (wrapper.getAttribute('name') == 'email') {
            if (!wrapper.value.match(validationRules.emailReg)) {
                return false;
            } else {
                message.email = wrapper.value;
                return true;
            }
        }
        if (wrapper.getAttribute('name') == 'phoneNumber') {
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
 * @param {object} event объект события
 * 
 * @returns {boolean} значение bool обозначающее выполнение или невыполнение условий проверки валидации полей
 */
function mask(event) {
    let keyCode;
    event.keyCode && (keyCode = event.keyCode);
    var pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, (a) => {
            return i < val.length ? val.charAt(i++) : a
        });
    i = new_value.indexOf("_");
    if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
    }
    var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        (a) => {
            return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = new_value;
    }
    if (event.type == "blur" && this.value.length < 5) {
        this.value = "";
    }
}

/** 
 * Функция события открытия детальной информации описания карточки вакансии.
 * 
 * @param {object} cardButton объект DOM кнопки открытия детальной информации описания карточки вакансии
 */
const detailsDescriptionEvent = (cardButton) => {
    const card = cardButton.closest('.card');
    const cardDetails = card.querySelector('.card__details');

    card.querySelector('.card__description-footer').classList.toggle('card__description-footer--hide');
    card.querySelector('.card__description').classList.toggle('card__description--full');
    if (cardButton.innerText == 'More details') {
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
const loadCardsEvent = (cardData, loadCardButton) => (event) => {
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
        }, 4500);
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
            params['&' + param.getAttribute('data-key') + '='] = paramValue;
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
const filterCardLoadEvent = (cardData, loadCardButton) => (event) => {
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
    }, 4500);
}

/** 
 * Функция события сброса фильтров и загрузки карточек по умолчанию.
 * 
 * @param {object} cardData объект содержащий параметры работы с API загрузки карточек
 */
const filterCardClearEvent = (cardData) => (event) => {
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
const filterButtonToggleOptionSelectedVisibleEvent = (selectList, filterButton) => (event) => {
    selectList.classList.toggle('select-wrapper__list--visible');
    filterButton.blur();
}

/** 
 * Функция события переключения стрелок(изображений) на кнопках.
 * 
 * @param {object} filter объект DOM кнопки фильтра на котором сработало событие
 * @param {object} listFilters объекты DOM других(всех кроме нажатой) кнопок выбора фильтрации
 */
const filterResetArrowEvent = (filter, listFilters) => (event) => {
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
const selectListItemEvent = (selectList, filterButton, item) => (event) => {
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
const listItemsHideClickEvent = (selectList, filterButton) => (event) => {
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
const listItemsHideKeydownEvent = (selectList, filterButton) => (event) => {
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

                addListener(filterButton, filterButtonToggleOptionSelectedVisibleEvent(selectList, filterButton), 'click');
                for (const item of selectListItem) {
                    addListener(item, selectListItemEvent(selectList, filterButton, item), 'click');
                }
                addListener(document, listItemsHideClickEvent(selectList, filterButton), 'click');
                addListener(document, listItemsHideKeydownEvent(selectList, filterButton), 'keydown');
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
const formSubmit = (form, formWrappers) => (event) => {
    const message = {
        name: '',
        email: '',
        phoneNumber: '',
        comment: '',
    };
    if (form !== null) {
        if (!submitForm(message, formWrappers)) {
            evt.preventDefault();
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

    addListener(loadCardButton, loadCardsEvent(cardData, loadCardButton), 'click');
    addListener(filterCards, filterCardLoadEvent(cardData, filterCards), 'click');
    addListener(filtersClear, filterCardClearEvent(cardData), 'click');
    filterDataEvents(wrappers);
    for (const filter of filters) {
        addListener(filter, filterResetArrowEvent(filter, filters), 'click');
    }
    addListener(phone, mask, 'input');
    addListener(phone, mask, 'focus');
    addListener(phone, mask, 'blur');
    addListener(phone, mask, 'keydown');
    addListener(form, formSubmit(form, formWrappers), 'submit');
}

window.onload = () => {
    const cardData = new ApiSettings();

    cardData.loadCardData();
    addEvents(cardData);
};