'use strict';
let INDEX_CARD_PER_PAGE = 1;

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
    return `
    <div class = "card card-block__item">
      <div class = "card__body">
        <div class = "card__title">
          <div class = "card__header-logo container-header-logo"
            <h4 class = "card__position-title">${this.#title}</h4>
            <img class = "card__logo" src = "${this.#logoUrl}" alt = 'Company logo'>
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
          <button class = "link card__details-button" onClick = "ToDo">Details</button>
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

  constructor(numCardInPage = 5, maxCardLoading = 2000, cards = []) {
    this.#numCardInPage = numCardInPage;
    this.#maxCardLoading = maxCardLoading;
    this.#cards = cards;
  }
  get numCardInPage() {
    return this.#numCardInPage;
  }
  get maxCardLoading() {
    return this.#maxCardLoading;
  }

  get cards() {
    return this.#cards;
  }
}

class CardsHandler {

  async cardApiLoadData(perPage, page, params = {}){
    let param = '';
    params.map((key, value) => {
      param += '&' + key + '=' + value;
    });

    await fetch(`https://api.hh.ru/vacancies?per_page=${perPage}&page=${page}${params}`)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Ошибка при выполнении запроса');
      }
    })
    .then(function(data) {
      return data.items.map(item => {//Todo
        let cardsDefinition = cardCompletionAbstract(item);
      });
      //data.items.map(item => {
      //  return cardFullApiLoadData(item.id)
      //});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  async cardFullApiLoadData(id) {
    const response = await fetch(`https://api.hh.ru/vacancies/${id}`)
   .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Ошибка при выполнении запроса');
    }
   }).then(function(data) {
    return cardCompletionAbstract(data);
   });
  }

  cardCompletionAbstract(item) {
    let card = new Card(item.id, item?.name, item?.description, item.employer?.logo_urls?.original, 
        {
          form: item?.employment ? item.employment.form : "Not Selected", 
          company: item?.employer?.name ? item.employer.name : "Not Selected",
          web: item?.employer?.alternate_url ? item.employer.alternate_url : "Not Selected",
          address: item?.area?.name ? item.area.name : "Not Selected"
        }
        );
    return card;
  }

  cardAppendOnRoot(cards, elem, perPage, page, params = {}){// ToDo вытащить? и вызывать с вызовом загрузки данных  и пройтись циклом для вставки данных в DOM
    elem;
  }
}

function addListener(btn, func) { 
  if (btn.clickHandler) {
      btn.removeEventListener('click', btn.clickHandler);
  }

  btn.addEventListener('click', func);
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

////

let index = 1;








async function apiLoadCard(page, param1, param2) {
  let params = '';
  if (param1 !== 'NotSelected')
    params = '&employment=' + param1;

  if (param2 !== 'NotSelected')
    params += '&experience=' + param2;
  await fetch('https://api.hh.ru/vacancies?per_page=5&page=' + page + params)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Ошибка при выполнении запроса');
      }
    })
    .then(function(data) {
      data.items.forEach(item => {
        const card = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardTitle = document.createElement('div');
        const cardWorkingCondition = document.createElement('div');
        const cardDescription = document.createElement('div');
        const cardDetails = document.createElement('div');
        const cardPositionTitle = document.createElement('h4');
        const cardLogo = document.createElement('img');
        const cardRespondButton = document.createElement('button');
        const cardFormWorkingTime = document.createElement('p');
        const cardCompanyName = document.createElement('p');
        const cardWebsite = document.createElement('p');
        const cardAddress = document.createElement('p');
        const cardDataWorkingTime = document.createElement('span');
        const cardDataCompanyName = document.createElement('span');
        const cardDataWebsite = document.createElement('a');
        const cardDataAddress = document.createElement('span');
        const cardDetailsButton = document.createElement('button');
        const footerDescription = document.createElement('div');
        const containerHeaderLogo = document.createElement('div');


        card.className = 'card card-block__item';
        cardBody.className = 'card__body';
        cardTitle.className = 'card__title';
        containerHeaderLogo.className = 'container-header-logo';
        cardWorkingCondition.className = 'card__working-condition';
        cardDescription.className = 'card__description';
        footerDescription.className = 'card__description-footer';
        fetch('https://api.hh.ru/vacancies/' + item.id).then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Ошибка при выполнении запроса');
          }
        }).then(function(data) {
          if (data.description !== undefined && data.description !== null && data.description !== "") {
            cardDescription.innerHTML = data.description
            cardDetailsButton.addEventListener('click', function() {
              footerDescription.classList.toggle('card__description-footer_hide');
              cardDescription.classList.toggle('card__description_full');
            });
            cardDescription.appendChild(footerDescription);
          } else {
            cardDescription.innerHTML = "Not specified";
          }
        });
        cardDetails.className = 'card__details card__details_down';
        cardPositionTitle.className = 'card__position-title';
        cardPositionTitle.innerHTML = item.name;
        cardLogo.className = 'card__logo';
        cardLogo.alt = 'Company logo';
        if (item.employer.logo_urls !== undefined && item.employer.logo_urls !== null && item.employer.logo_urls !== "") {
          cardLogo.setAttribute('src', item.employer.logo_urls.original);
        } else {
          cardLogo.classList.add('card__logo_hide');
        }
        cardRespondButton.className = 'card__respond-button';
        cardRespondButton.innerHTML = 'Respond';

        cardFormWorkingTime.className = 'condition-gray card__form-working-time';
        cardCompanyName.className = 'condition-gray card__company-name';
        cardWebsite.className = 'condition-gray card__website';
        cardAddress.className = 'condition-gray card__adress';

        cardDataWorkingTime.className = 'card__data-working-time';
        cardDataWorkingTime.setAttribute("data", item.employment.id);
        item.employment.name !== undefined && item.employment.name !== null && item.employment.name !== "" ?
          cardDataWorkingTime.innerHTML = item.employment.name : cardDataWorkingTime.innerHTML = "Not specified";

        cardDataCompanyName.className = 'card__data-company-name';
        item.employer.name !== undefined && item.employer.name !== null && item.employer.name !== "" ?
          cardDataCompanyName.innerHTML = item.employer.name : cardDataCompanyName.innerHTML = "Not specified";
        cardDataWebsite.className = 'span card__data-website';

        if (item.employer.url !== undefined && item.employer.url !== null && item.employer.url !== "") {
          fetch(item.employer.url).then(function(response) {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Ошибка при выполнении запроса');
            }
          }).then(function(url) {
            if (url.site_url !== undefined && url.site_url !== null && url.site_url !== "") {
              cardDataWebsite.innerHTML = url.site_url;
              cardDataWebsite.setAttribute('href', url.site_url);
            } else {
              cardDataWebsite.innerHTML = "Not specified";
            }
          });
        } else {
          cardDataWebsite.innerHTML = "Not specified";
        }

        cardDataAddress.className = 'card__data-address';
        item.area.name !== undefined && item.area.name !== null && item.area.name !== "" ?
          cardDataAddress.innerHTML = item.area.name : cardDataAddress.innerHTML = "Not specified";

        cardFormWorkingTime.innerText = 'Form';
        cardFormWorkingTime.appendChild(cardDataWorkingTime);
        cardCompanyName.innerText = 'Company';
        cardCompanyName.appendChild(cardDataCompanyName);
        cardWebsite.innerText = 'Web';
        cardWebsite.appendChild(cardDataWebsite);
        cardAddress.innerText = 'Address';
        cardAddress.appendChild(cardDataAddress)
        cardWorkingCondition.appendChild(cardFormWorkingTime);
        cardWorkingCondition.appendChild(cardCompanyName);
        cardWorkingCondition.appendChild(cardWebsite);
        cardWorkingCondition.appendChild(cardAddress);
        cardDetailsButton.className = 'link card__details-button';
        cardDetailsButton.innerHTML = 'More details';
        cardDetailsButton.addEventListener('click', () => {
          if (cardDetailsButton.innerText == 'More details') {
            cardDetailsButton.innerHTML = 'Less details';
            cardDetails.classList.add('card__details_up');
            cardDetails.classList.remove('card__details_down');
          } else {
            cardDetailsButton.innerHTML = 'More details';
            cardDetails.classList.remove('card__details_up');
            cardDetails.classList.add('card__details_down');
          }
        });
        cardDetails.appendChild(cardDetailsButton);
        containerHeaderLogo.appendChild(cardPositionTitle);
        containerHeaderLogo.appendChild(cardLogo);
        cardTitle.appendChild(containerHeaderLogo);
        cardTitle.appendChild(cardRespondButton);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardWorkingCondition);
        cardBody.appendChild(cardDescription);
        cardBody.appendChild(cardDetails);
        card.appendChild(cardBody);
        document.querySelector('.card-block__list').appendChild(card);
      });

    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = () => {
  const loadCards = document.querySelector('.card-block__load-card');
  const filterCards = document.querySelector('.filters__search');
  const filtersClear = document.querySelector('.filters__clear-filters-input');
  const form = document.querySelector('.request-block__form');
  apiLoadCard(index, 'NotSelected', 'NotSelected');
  const wrappers = document.querySelectorAll('.filters__label');
  const formWrappers = document.querySelectorAll('.form__label');
  loadCards.addEventListener('click', () => {
    if (index * 5 >= 2000) {
      loadCards.classList.add('card-block__load-card_hide');
      index = 1;
    } else {
      index++;
      apiLoadCard(
        index,
        document.querySelector('.filter-form').getAttribute('data'),
        document.querySelector('.filter-experience').getAttribute('data')
      );
    }
  });
  filterCards.addEventListener('click', () => {
    index = 1;
    const filterForm = document.querySelector('.filter-form');
    const filterExperience = document.querySelector('.filter-experience');
    filterForm.setAttribute('data', filterForm.getAttribute('preliminary-data'));
    filterExperience.setAttribute('data', filterExperience.getAttribute('preliminary-data'));
    document.querySelector('.card-block__list').innerText = '';
    apiLoadCard(
      index,
      filterForm.getAttribute('data'),
      filterExperience.getAttribute('data')
    );
  });
  filtersClear.addEventListener('click', () => {
    index = 1;
    const filterForm = document.querySelector('.filter-form');
    const filterExperience = document.querySelector('.filter-experience');
    filterForm.setAttribute('data', 'NotSelected');
    filterExperience.setAttribute('data', 'NotSelected');
    filterForm.setAttribute('preliminary-data', 'NotSelected');
    filterExperience.setAttribute('preliminary-data', 'NotSelected');
    filterForm.innerText = 'Not selected';
    filterExperience.innerText = 'Not selected';
    filterForm.classList.remove('select-wrapper__input_selected');
    filterExperience.classList.remove('select-wrapper__input_selected');
    document.querySelector('.card-block__list').innerText = '';
    apiLoadCard(index, 'NotSelected', 'NotSelected');
    document.querySelector('.filters__clear-filters').classList.add('filters__clear-filters_hide');
  });

  document.querySelector('.filter-form').addEventListener('click', (e) => {
    const filterForm = document.querySelector('.filter-form');
    const filterExperience = document.querySelector('.filter-experience');
    if (filterExperience.classList.contains('select-wrapper__input_up')) {
      resetArrowImg(filterForm);
      filterExperience.classList.remove('select-wrapper__input_up');
      filterExperience.classList.add('select-wrapper__input_down');
    } else {
      resetArrowImg(filterForm);
    }
  });

  document.querySelector('.filter-experience').addEventListener('click', (e) => {
    const filterForm = document.querySelector('.filter-form');
    const filterExperience = document.querySelector('.filter-experience');
    if (filterForm.classList.contains('select-wrapper__input_up')) {
      resetArrowImg(filterExperience);
      filterForm.classList.remove('select-wrapper__input_up');
      filterForm.classList.add('select-wrapper__input_down');
    } else {
      resetArrowImg(filterExperience);
    }
  });

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

  document.querySelector('.inputPhone').addEventListener('input', mask, false);
  document.querySelector('.inputPhone').addEventListener('focus', mask, false);
  document.querySelector('.inputPhone').addEventListener('blur', mask, false);
  document.querySelector('.inputPhone').addEventListener('keydown', mask, false);

  form.addEventListener(
    "submit",
    function(evt) {
      const message = {
        name: '',
        email: '',
        phoneNumber: '',
        comment: '',
      };
      if (form !== null) {

        if (!submitForm(message)) {
          evt.preventDefault();
          return false;
        }
      }
      alert('Sent name: ' + message.name + '\nSent email: ' + message.email + '\nSent phone: ' + message.phoneNumber + '\nSent comment: ' + message.comment);

    });


  function submitForm(message) {
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



  if (wrappers !== null)//ToDo
    wrappers.forEach((selectWrapper) => {
      const filterButton = selectWrapper.querySelector('.select-wrapper__input');
      if (filterButton !== null) {
        const selectList = selectWrapper.querySelector('.select-wrapper__list');
        const selectListItem = selectList.querySelectorAll('.select-wrapper__list-item');
        filterButton.addEventListener('click', (e) => {
          selectList.classList.toggle('select-wrapper__list_visible');
          filterButton.blur();
        });

        selectListItem.forEach((item) => {
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            filterButton.innerText = item.innerText;
            filterButton.setAttribute('data', 'NotSelected');
            filterButton.setAttribute('preliminary-data', item.getAttribute('data-value'));
            filterButton.blur();
            filterButton.classList.add('select-wrapper__input_selected');
            document.querySelector('.filters__clear-filters').classList.remove('filters__clear-filters_hide');
          });
        });

        document.addEventListener('click', (e) => {
          if (e.target !== filterButton) {
            selectList.classList.remove('select-wrapper__list_visible');
            filterButton.classList.add('select-wrapper__input_active');
            filterButton.classList.remove('select-wrapper__input_up');
            filterButton.classList.add('select-wrapper__input_down');
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Tab' || e.key === 'Escape') {
            selectList.classList.remove('select-wrapper__list_visible');
            filterButton.classList.remove('select-wrapper__input_up');
            filterButton.classList.add('select-wrapper__input_down');
          }
        });
      }
    });

};