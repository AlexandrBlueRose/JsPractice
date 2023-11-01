'use strict';

const validationRules = {
  nameLength: 1,
  emailReg: /^.+@[^\.].*\.[a-z]{2,}$/,
  phoneReg: 17
}

class Card {
  #id;
  #title;
  #description;
  #logoUrl;
  #conditions;
  #classOption = '';

  constructor(id = 0, title = "Not Selected", description = "Not Selected", logoUrl = "", conditions = 
  {
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

  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }
  set description(description) {
    this.#description = description;
  }

  get logoUrl() {
    return this.#logoUrl;
  }
  set logoUrl(logoUrl) {
    this.#logoUrl = logoUrl;
  }

  get conditions() {
    return this.#conditions;
  }

  cardDefinition() {
    if(!this.#logoUrl){
      this.#classOption = 'visually-hidden';
    }
    return `
    <div class = "card card-block__item">
      <div class = "card__body">
        <div class = "card__title">
          <div class = "card__header-logo container-header-logo">
            <h4 class = "card__position-title">${this.#title}</h4>
            <img class = "card__logo ${this.#classOption}" src = "${this.#logoUrl}" alt = 'Company logo'>
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
        <div class = "card__details card__details_down">
          <button class = "link card__details-button" onClick = "detailsDescriptionEvent(this)">More details</button>
        </div>
      </div>
    </div>
    `;
  }

}

class CardsData {
  #cards;
  #numCardInPage;
  #maxCardLoading;
  #indexPage;

  constructor(numCardInPage = 5, maxCardLoading = 2000, cards = []) {
    this.#numCardInPage = numCardInPage;
    this.#maxCardLoading = maxCardLoading;
    this.#cards = cards;
    this.#indexPage = 1;
  }
  getNumCardInPage() {
    return this.#numCardInPage;
  }
  getMaxCardLoading() {
    return this.#maxCardLoading;
  }

  getCards() {
    return this.#cards;
  }

  getIndexPage(){
    return this.#indexPage;
  }

  indexPageUp(){
    this.#indexPage++;
  }
  indexPageReset(){
    this.#indexPage = 1;
  }

  clearCards() {
    this.#cards = [];
  }

  loadCardData(params = {}) { 
    if (this.getIndexPage() * this.getNumCardInPage() <= this.getMaxCardLoading()) {
      const cardHandler = new CardsHandler();
      cardHandler.cardAppendOnRoot(this.getCards(), this.getNumCardInPage(), this.getIndexPage(), params);
      this.indexPageUp();
    }
    else {
      document.querySelector('.card-block__load-card').classList.add('visually-hidden');
    }
  }
}

class CardsHandler {

  async cardApiLoadData(cards, perPage, page, params = {}){
    let param = '';
    if(isEmptyObject(params)){
      params = '';
    } else{
      for (const [key, value] of Object.entries(params)) {
        param += key + value;
      }
    }
    try {
      const cardsData = await fetch(`https://api.hh.ru/vacancies?per_page=${perPage}&page=${page}${param}`);
      const cardsJson = await cardsData.json();
      for(const item of cardsJson.items.entries()) {
        await this.cardFullApiLoadData(item[1].id, cards);
      };
    }
    catch (err) {
      console.error(err);
    };
  }

  async cardFullApiLoadData(id, cards) {
    try {
      const cardData = await fetch(`https://api.hh.ru/vacancies/${id}`);
      const cardsJson = await cardData.json();
      cards.push(this.cardCompletionAbstract(cardsJson));
    }
    catch (err) {
      console.error(err);
    };
  }

  cardCompletionAbstract(item) {
    let card = new Card(item.id, item?.name, item?.description, item.employer?.logo_urls?.original, 
        {
          form: item?.employment ? item.employment.name : "Not Selected", 
          company: item?.employer?.name ? item.employer.name : "Not Selected",
          web: item?.employer?.alternate_url ? item.employer.alternate_url : "Not Selected",
          address: item?.area?.name ? item.area.name : "Not Selected"
        }
        );
    return card;
  }

  async cardAppendOnRoot(cards, perPage, page, params = {}) {
    await this.cardApiLoadData(cards, perPage, page, params);
    if (cards.length < perPage) {
      document.querySelector('.card-block__load-card').classList.add('visually-hidden');
    }
    for (const card of cards) {
      document.querySelector('.card-block__list').insertAdjacentHTML('beforeend', card.cardDefinition());
    }
  }
}



function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function addListener(elem, func, event) { 
  if (elem.clickHandler) {
    elem.removeEventListener(event, elem.clickHandler);
  }

  elem.addEventListener(event, func);
}

function resetArrowImg(elem) {
  if (elem.classList.contains('select-wrapper__input_down')) {
    elem.classList.add('select-wrapper__input_up');
    elem.classList.remove('select-wrapper__input_down');
  } else {
    elem.classList.remove('select-wrapper__input_up');
    elem.classList.add('select-wrapper__input_down');
  }
}

function validation(wrapper, message) {
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

function submitForm(message, formWrappers) {
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

function mask(event) {
  let keyCode;
  event.keyCode && (keyCode = event.keyCode);
  var pos = this.selectionStart;
  if (pos < 3) event.preventDefault();
  var matrix = "+7 (___) ___ ____",
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = this.value.replace(/\D/g, ""),
    new_value = matrix.replace(/[_\d]/g, function(a) {
      return i < val.length ? val.charAt(i++) : a
    });
  i = new_value.indexOf("_");
  if (i != -1) {
    i < 5 && (i = 3);
    new_value = new_value.slice(0, i)
  }
  var reg = matrix.substr(0, this.value.length).replace(/_+/g,
    function(a) {
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


const detailsDescriptionEvent = ( cardButton ) => {
  const card = cardButton.closest('.card');
  card.querySelector('.card__description-footer').classList.toggle('card__description-footer_hide');
  card.querySelector('.card__description').classList.toggle('card__description_full');
  const cardDetails = card.querySelector('.card__details');
  if (cardButton.innerText == 'More details') {
    cardButton.innerHTML = 'Less details';
    cardDetails.classList.add('card__details_up');
    cardDetails.classList.remove('card__details_down');
  } else {
    cardButton.innerHTML = 'More details';
    cardDetails.classList.remove('card__details_up');
    cardDetails.classList.add('card__details_down');
  }
}

const loadCardsEvent = ( cardData, loadCardButton ) => ( event ) => {
  if (cardData.getIndexPage() * cardData.getNumCardInPage() >= cardData.getMaxCardLoading()) {
    document.querySelector('.card-block__load-card').classList.add('card-block__load-card_hide');
    cardData.indexPageReset();
    document.querySelector('.card-block__load-card').classList.add('visually-hidden');
  } else {
    let params = {};
    loadCardButton.disabled = true;
    loadCardDataWithParams(params, cardData);
    setTimeout(() => {//todo
      loadCardButton.disabled = false;
    }, 3000);
  }
}

function loadCardDataWithParams(params, cardData) {
  const paramsList = document.querySelectorAll('.filter');
  for (const param of paramsList){
    const paramValue = param.getAttribute('data-eventual');
    if(paramValue !== 'NotSelected'){
      params['&'+param.getAttribute('data-key')+'='] = paramValue;
    }
  }
  cardData.clearCards();  
  cardData.loadCardData(params);
}
const filterCardLoadEvent = (cardData, loadCardButton) => ( event ) => {
  cardData.indexPageReset();
  document.querySelector('.card-block__load-card').classList.remove('visually-hidden');
  const paramsList = document.querySelectorAll('.filter');
  for (const param of paramsList){
    param.setAttribute('data-eventual', param.getAttribute('data-preliminary'));
  }
  document.querySelector('.card-block__list').innerText = '';
  let params = {};
  loadCardButton.disabled = true;
  loadCardDataWithParams(params, cardData);
  setTimeout(() => {
      loadCardButton.disabled = false;
    }, 3000);
}

const filterCardClearEvent = (cardData) => ( event ) => {
  cardData.indexPageReset();
  document.querySelector('.card-block__load-card').classList.remove('visually-hidden');
  const paramsList = document.querySelectorAll('.filter');
  for (const param of paramsList){
    param.setAttribute('data-eventual', 'NotSelected');
    param.setAttribute('data-preliminary', 'NotSelected');
    param.innerText = 'Not selected';
    param.classList.remove('select-wrapper__input_selected');
  }
  document.querySelector('.card-block__list').innerText = '';
  document.querySelector('.filters__clear-filters').classList.add('filters__clear-filters_hide');
  loadCardDataWithParams({}, cardData);
}

const filterButtonToggleOptionSelectedVisibleEvent = (selectList, filterButton) => ( event ) => {
  selectList.classList.toggle('select-wrapper__list_visible');
  filterButton.blur();
}

const filterResetArrowEvent = (filter, listFilters)  => ( event ) => {
    if(filter.classList.contains('select-wrapper__input_up')){
      resetArrowImg(filter);
      Object.entries(listFilters).filter(currentFilter => filter !== currentFilter[1])
      .forEach(currentFilter => {
        currentFilter?.classList.remove('select-wrapper__input_up');
        currentFilter?.classList.add('select-wrapper__input_down');
      });
      
    } else{
      resetArrowImg(filter);
    }
}

const selectListItemEvent = (selectList, filterButton, item) => ( event ) => {
  event.stopPropagation();
  filterButton.innerText = item.innerText;
  filterButton.setAttribute('data-eventual', 'NotSelected');
  filterButton.setAttribute('data-Preliminary', item.getAttribute('data-value'));
  filterButton.blur();
  filterButton.classList.add('select-wrapper__input_selected');
  filterButton.classList.remove('select-wrapper__input_up');
  filterButton.classList.add('select-wrapper__input_down');
  selectList.classList.remove('select-wrapper__list_visible');
  document.querySelector('.filters__clear-filters').classList.remove('filters__clear-filters_hide');
}

const listItemsHideClickEvent = (selectList, filterButton)  => ( event ) => {
  if (event.target !== filterButton) {
    selectList.classList.remove('select-wrapper__list_visible');
    filterButton.classList.add('select-wrapper__input_active');
    filterButton.classList.remove('select-wrapper__input_up');
    filterButton.classList.add('select-wrapper__input_down');
  }
}

const listItemsHideKeydownEvent = (selectList, filterButton)  => ( event ) => {
  if (event.key === 'Tab' || event.key === 'Escape') {
    selectList.classList.remove('select-wrapper__list_visible');
    filterButton.classList.remove('select-wrapper__input_up');
    filterButton.classList.add('select-wrapper__input_down');
  }
}

const filterDataEvents = (wrappers) => {
  if (wrappers !== null){
    for (const selectWrapper of wrappers) {
      const filterButton = selectWrapper.querySelector('.select-wrapper__input');
      if (filterButton !== null) {
        const selectList = selectWrapper.querySelector('.select-wrapper__list');
        const selectListItem = selectList.querySelectorAll('.select-wrapper__list-item');
        addListener(filterButton, filterButtonToggleOptionSelectedVisibleEvent(selectList, filterButton), 'click');
        for(const item of selectListItem) {
          addListener(item, selectListItemEvent(selectList, filterButton, item), 'click');
        }
        addListener(document, listItemsHideClickEvent(selectList, filterButton), 'click');
        addListener(document, listItemsHideKeydownEvent(selectList, filterButton), 'keydown');
      }
    }
  }
}

const formSubmit = (form, formWrappers) => ( event ) => {
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

window.onload = () => {
  const cardData = new CardsData();
  cardData.loadCardData();

  const loadCardButton = document.querySelector('.card-block__load-card');
  const filterCards = document.querySelector('.filters__search');
  const filtersClear = document.querySelector('.filters__clear-filters-input');
  const wrappers = document.querySelectorAll('.filters__label');
  const filters = document.querySelectorAll('.filter');
  const phone  = document.querySelector('.inputPhone');

  const form = document.querySelector('.request-block__form');
  const formWrappers = document.querySelectorAll('.form__label');

  addListener(loadCardButton, loadCardsEvent(cardData, loadCardButton), 'click');
  addListener(filterCards, filterCardLoadEvent(cardData, filterCards), 'click');
  addListener(filtersClear, filterCardClearEvent(cardData), 'click');
  filterDataEvents(wrappers);
  for(const filter of filters) {
    addListener(filter, filterResetArrowEvent(filter, filters), 'click');
  }
  addListener(phone, mask, 'input');
  addListener(phone, mask, 'focus');
  addListener(phone, mask, 'blur');
  addListener(phone, mask, 'keydown');

  addListener(form, formSubmit(form, formWrappers), 'submit');
};