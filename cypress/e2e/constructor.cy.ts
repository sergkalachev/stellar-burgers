const SELECTORS = {
  modal: '#modals',
  bunIngredients: 'ul[data-cy="bun-ingredients"]',
  constructorElement: '[data-cy=burger-constructor]',
  closeModalButton: '[data-cy="modal-close-button"]',
  overlay: '[data-cy="overlay"]'
};

describe('Добавление ингридиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Добавляем ингридиенты и проверяем что они в конструкторе', () => {
    // проверяем наличие конструктора
    cy.contains('Соберите бургер').should('exist');
    // добавляем ингридиенты
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
    // проверяем что были добавлены именно выбранные нами ингридиенты
    cy.get('.constructor-element_pos_top').contains('Булка1');
    cy.get('.constructor-element_pos_bottom').contains('Булка1');
    cy.get('.constructor-element').contains('Соус');
  });
});

describe('Проверка работы модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Проверяем работу модальных окон', () => {
    // открываем модальное окно предварительно проверив имя ингридиента
    cy.get(SELECTORS.modal).children().should('have.length', 0);
    cy.get(SELECTORS.bunIngredients).find('li').first().as('firstBun');
    cy.get('@firstBun').find('p').contains('Булка1');
    cy.get('@firstBun').find('a').click();
    // проверяем что модальное окно открыто
    cy.get(SELECTORS.modal).children().should('have.length', 2);
    // проверяем что открыт тот же ингридиент
    cy.get(SELECTORS.modal).contains('Булка1');
    // закрываем модальное окно по кнопке
    cy.get(SELECTORS.closeModalButton).click();
    // проверяем что модальное окно закрыто
    cy.get(SELECTORS.modal).children().should('have.length', 0);
    // открываем модальное окно
    cy.get('@firstBun').find('a').click();
    // проверяем что модальное окно открыто
    cy.get(SELECTORS.modal).children().should('have.length', 2);
    // закрываем модальное окно кликом через оверлей
    cy.get(SELECTORS.overlay).click('left', { force: true });
    // проверяем что модальное окно закрыто
    cy.get(SELECTORS.modal).children().should('have.length', 0);
  });
});

describe('Проверка создания заказа', () => {
  beforeEach(() => {
    // настройка перехвата запросов во всех тестах - обязательное требование
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'post_order.json' });
    // добавляем моковые токены
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('refresh-token')
    );
    cy.setCookie('accessToken', 'access-token');
    cy.viewport(1300, 800);
    cy.visit('/');
  });
  // зачищаем токены каждый раз
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Проверяем создание и отправку заказа', () => {
    // добавляем ингридиенты
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
    // отпроавляем заказ по кнопке
    cy.contains('Оформить заказ').click();
    // проверяем что модальное окно открылось и его параметры
    cy.get(SELECTORS.modal).children().should('have.length', 2);
    cy.get(SELECTORS.modal).contains('59761');
    // закрываем модальное окно
    cy.get(SELECTORS.closeModalButton).click();
    // проверяем что модальное окно закрыто
    cy.get(SELECTORS.modal).children().should('have.length', 0);
    //проверяем что ингридиентов больше нет в конструкторе
    cy.get(SELECTORS.constructorElement).contains('Булка1').should('not.exist');
    cy.get(SELECTORS.constructorElement).contains('Соус').should('not.exist');
  });
});
