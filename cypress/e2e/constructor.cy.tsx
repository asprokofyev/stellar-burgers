// константы для селекторов
const SELECTORS = {
  INGREDIENT_ITEM: '[data-testid="ingredient-item"]',
  INGREDIENT_ADD_BUTTON: 'button',
  MODAL_WINDOW: '[data-testid="modal-window"]',
  MODAL_CLOSE_BUTTON: '[data-testid="modal-close-button"]',
  NO_BUN_MESSAGE: '[data-testid="no-bun-message"]',
  NO_FILLING_MESSAGE: '[data-testid="no-filling-message"]',
  ORDER_BUTTON: '[data-testid="order-button"]'
};

describe('Тестируем страницу Конструктора бургера', () => {
  // перед каждым тестом загружаем моковые данные и заходим на страницу конструктора
  beforeEach(() => {
    // моки для ингредиентов
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // мок для пользователя
    cy.intercept('GET', '**/api/auth/user**', { fixture: 'user.json' }).as(
      'getUser'
    );

    // мок для создания заказа
    cy.intercept('POST', '**/api/orders**', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // устанавливаем моковые токены авторизации
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    // заходим на страницу конструктора
    cy.visit('/');
  });

  it('Загрузку ингридиентов и отображение страницы конструктора', () => {
    // почему-то не смог прописать для заголовка страницы data-атрибут
    // прилось искать по тэгу, т.к. он один на странице
    cy.get(`h1`).should('be.visible').and('contain', 'Соберите бургер');
    // проверяем что загрузились ингредиенты и их миниму 3 штуки
    cy.get(SELECTORS.INGREDIENT_ITEM).should('have.length.at.least', 3);
    // проверяем что отобразилась область сборки бургера
    cy.get('[data-testid="constructor-area"]').should('be.visible');
  });

  it('Работа модального окна с детальной информацией об ингредиенте', () => {
    // кликаем на первый ингредиент (булку)
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();

    // проверяем, что модальное окно открылось
    cy.get(SELECTORS.MODAL_WINDOW).should('be.visible');
    cy.get('[data-testid="modal-header"]').should(
      'contain',
      'Детали ингредиента'
    );

    // закрываем модальное окно по клику на крестик
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL_WINDOW).should('not.exist');

    // открываем модальное окно снова
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();
    cy.get(SELECTORS.MODAL_WINDOW).should('be.visible');

    // закрываем модальное окно по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get(SELECTORS.MODAL_WINDOW).should('not.exist');
  });

  it('Добавление булки в конструктор сверху и снизу', () => {
    // Находим первую булку и добавляем в конструктор
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .first()
      .within(() => {
        // и тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // Проверяем, что булка добавилась в конструктор
    cy.get(SELECTORS.NO_BUN_MESSAGE).should('not.exist');
    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
  });

  it('Добавление начинки в бургер', () => {
    // сначала добавляем булку
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .first()
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // находим начинку и добавляем в бургер
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .eq(2)
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // Проверяем, что начинка добавилась в конструктор
    cy.get(SELECTORS.NO_FILLING_MESSAGE).should('not.exist');
    cy.get('[data-testid="constructor-filling-item"]').should('exist');
  });

  it('Успешное создание заказа', () => {
    // сначала добавляем булку
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .first()
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // находим начинку и добавляем в бургер
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .eq(2)
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // находим соус и добавляем в бургер
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .eq(3)
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // Проверяем, что кнопка заказа активна
    cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');

    // Нажимаем кнопку "Оформить заказ"
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем, что открылось модальное окно с номером заказа
    cy.wait('@createOrder');
    cy.get(SELECTORS.MODAL_WINDOW).should('be.visible');

    // Проверяем, что номер заказа соответствует моковым данным (12345)
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL_WINDOW).should('not.exist');

    // Проверяем, что конструктор очистился после создания заказа
    cy.get(SELECTORS.NO_BUN_MESSAGE).should('be.visible');
    cy.get(SELECTORS.NO_FILLING_MESSAGE).should('be.visible');
  });

  it('Редирект на страницу авторизации при попытке создать заказ неавторизованным пользователем', () => {
    // Удаляем токены авторизации
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });

    // Мок для неудачной проверки пользователя
    cy.intercept('GET', '**/api/auth/user**', { statusCode: 401 }).as(
      'getUserUnauthorized'
    );

    // добавляем булку
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .first()
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // находим начинку и добавляем в бургер
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .eq(2)
      .within(() => {
        // тут не смог добавить data-атрибут на кнопку, поэтому ищу по тэгу...
        cy.get(SELECTORS.INGREDIENT_ADD_BUTTON).click();
      });

    // Нажимаем кнопку "Оформить заказ"
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем, что произошел редирект на страницу логина
    cy.url().should('include', '/login');
  });
});
