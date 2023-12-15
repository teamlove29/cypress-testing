/* eslint-disable cypress/unsafe-to-chain-command */
import { faker } from '@faker-js/faker';

const { _ } = Cypress;

describe('Post Form', () => {
  beforeEach(() => {
    cy.visit('/cypress/post-form-data');
  });

  it.only('handles form input correctly', () => {
    type IPost = {
      title: string;
      category: string;
      status: string;
      content: string;
    };

    const newPost: IPost = {
      title: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(['java', 'python', 'ruby']),
      status: faker.helpers.arrayElement(['drafted', 'published']),
      content: faker.lorem.paragraph(),
    };

    cy.interceptApi('POST', '/posts', {}).as('createPost');

    cy.getByTestID('upload-input').attachFile('images/image.jpg');
    cy.getByTestID('post-form-title').type(newPost.title);
    cy.getByTestID('post-form-category').select(newPost.category);
    cy.getByTestID(`post-form-${newPost.status}-status`).check();
    cy.getByTestID(`post-form-content`).type(newPost.content);
    cy.getByTestID(`post-form-submit-button`).click();

    cy.wait('@createPost').interceptFormData((formData) => {
      expect(formData.title).to.eq(newPost.title);
      expect(formData.category).to.eq(newPost.category);
      expect(formData.status).to.eq(newPost.status);
      expect(formData.content).to.eq(newPost.content);
      expect(formData.image).to.eq('image.jpg');
    });
  });

  it('handles validation correctly', () => {
    cy.getByTestID('post-form-title').type('title').clear().blur();
    cy.getByTestID('post-form-content').type('content').clear().blur();

    cy.getByTestID('post-form-title-helper').should(
      'have.text',
      'title is a required field'
    );

    cy.getByTestID('post-form-content-helper').should(
      'have.text',
      'content is a required field'
    );

    cy.getByTestID('post-form-submit-button').should('be.disabled');
  });
});
