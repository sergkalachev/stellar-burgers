describe('Добавление ингридиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
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
    cy.visit('http://localhost:4000');
  });

  it('Проверяем работу модальных окон', () => {
    // открываем модальное окно предварительно проверив имя ингридиента
    cy.get('#modals').children().should('have.length', 0);
    cy.get('ul[data-cy="bun-ingredients"]')
      .find('li')
      .first()
      .find('p')
      .contains('Булка1');
    cy.get('ul[data-cy="bun-ingredients"]')
      .find('li')
      .first()
      .find('a')
      .click();
    // проверяем что модальное окно открыто
    cy.get('#modals').children().should('have.length', 2);
    // проверяем что открыт тот же ингридиент
    cy.get('#modals').contains('Булка1');
    // закрываем модальное окно по кнопке
    cy.get('[data-cy="modal-close-button"]').click();
    // проверяем что модальное окно закрыто
    cy.get('#modals').children().should('have.length', 0);
    // открываем модальное окно
    cy.get('ul[data-cy="bun-ingredients"]')
      .find('li')
      .first()
      .find('a')
      .click();
    // проверяем что модальное окно открыто
    cy.get('#modals').children().should('have.length', 2);
    // закрываем модальное окно кликом через оверлей
    cy.get('[data-cy="overlay"]').click('left', { force: true });
    // проверяем что модальное окно закрыто
    cy.get('#modals').children().should('have.length', 0);
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
    cy.visit('http://localhost:4000');
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
    cy.get('#modals').children().should('have.length', 2);
    cy.get('#modals').contains('59761');
    // закрываем модальное окно
    cy.get('[data-cy="modal-close-button"]').click();
    // проверяем что модальное окно закрыто
    cy.get('#modals').children().should('have.length', 0);
    //проверяем что ингридиентов больше нет в конструкторе
    cy.get('[data-cy=burger-constructor]')
      .contains('Булка1')
      .should('not.exist');
    cy.get('[data-cy=burger-constructor]')
      .contains('Булка1')
      .should('not.exist');
    cy.get('[data-cy=burger-constructor]').contains('Соус').should('not.exist');
  });
});
