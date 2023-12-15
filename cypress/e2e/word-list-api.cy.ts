import { faker } from '@faker-js/faker';
const { _ } = Cypress;

const createNewWord = (word: string) => {
  cy.getByTestID('my-word-input').type(word);
  cy.getByTestID('add-word-button').click();
};

const existingWord = 'My Word';

describe('Word List API', () => {
  context('with e2e testing', () => {
    beforeEach(() => {
      cy.request('DELETE', `${Cypress.env('apiUrl')}/word/reset`);
      cy.visit('/cypress/word-list-api');
      createNewWord(existingWord);
    });

    it('renders word correctly', () => {
      cy.getByTestID('word-list-item-1').should('have.text', existingWord);
    });

    it('addes new word correctly', () => {
      createNewWord('New Word');
      cy.getByTestID('word-list-item-1').should('have.text', existingWord);
      cy.getByTestID('word-list-item-2').should('have.text', 'New Word');
    });

    it('updates the word correctly', () => {
      cy.getByTestID('word-list-item-1')
        .findByTestID('edit-word-button')
        .click();
      cy.getByTestID('edit-word-input').clear();
      cy.getByTestID('edit-word-input').type('Edit Word');
      cy.getByTestID('edit-word-button').click();
      cy.getByTestID('word-list-item-1').should('have.text', 'Edit Word');
    });

    it('deletes the word correcly', () => {
      cy.getByTestID('word-list-item-1')
        .findByTestID('delete-word-button')
        .click();
      cy.getByTestID('word-list').should('not.contain', existingWord);
    });
  });

  context('with in interception', () => {
    const existingWord = [
      { id: 1, word: 'Ipsum1' },
      { id: 2, word: 'Ipsum2' },
      { id: 3, word: 'Lorem1' },
      { id: 4, word: 'Lorem2' },
    ];
    beforeEach(() => {
      // cy.interceptApi('GET', '/word', {
      //   words: existingWord,
      // });
      cy.intercept(
        {
          method: 'GET',
          pathname: '/api/v1/words',
        },
        {
          words: existingWord,
        }
      );

      cy.visit('/cypress/word-list-api');
    });

    it('renders word correctly', () => {
      for (const [index, { word }] of existingWord.entries()) {
        cy.getByTestID(`word-list-item-${index + 1}`).should('have.text', word);
      }
      cy.getByTestID('word-list-item-1').should('have.text', existingWord);
    });

    it('addes new word correctly', () => {
      // cy.interceptApi('POST', '/words', {
      //   statusCode: 201,
      //   body: { words: { id: 5, word: 'Word#1' } },
      // });

      cy.intercept(
        {
          method: 'POST',
          pathname: '/api/v1/words',
        },
        {
          statusCode: 201,
          body: { word: { id: 5, word: 'Word#1' } },
        }
      );

      cy.getByTestID('my-word-input').type('Word#1');
      cy.getByTestID('add-word-button').click();
      cy.getByTestID('word-list-item-5').should('have.text', 'Word#1');
    });

    it.only('allows to search keyword correctly', () => {
      const keyword = 'Lorem';
      const matchedWords = existingWord.filter((word) =>
        word.word.includes(keyword)
      );
      cy.intercept(
        {
          pathname: '/api/v1/words',
          query: { term: keyword },
        },
        {
          words: matchedWords,
        }
      ).as('query');

      cy.getByTestID('search-input').type(keyword);
      cy.wait('@query');
      cy.getByTestID('word-list')
        .find('li')
        .each(($element, index) => {
          cy.wrap($element).should('have.text', matchedWords[index].word);
        });
    });

    it('updates the word correctly', () => {
      // cy.interceptApi('PATCH', '/word/1', {
      //   words: { id: 1, word: 'Edit' },
      // });
      cy.intercept(
        {
          method: 'PATCH',
          pathname: '/api/v1/words/1',
        },
        {
          word: { id: 1, word: 'Edit' },
        }
      );

      cy.getByTestID('word-list-item-1')
        .findByTestID('edit-word-button')
        .click();
      cy.getByTestID('edit-word-input').clear();
      cy.getByTestID('edit-word-input').type('Edit');

      cy.getByTestID('word-list-item-1')
        .findByTestID('edit-word-button')
        .click();
      cy.getByTestID('word-list-item-1').should('have.text', 'Edit');
    });

    it('deletes the word correcly', () => {
      // cy.interceptApi('DELETE', '/word/1', {
      //   statusCode: 204,
      // });

      cy.intercept(
        {
          method: 'DELETE',
          pathname: '/api/v1/words/1',
        },
        {
          statusCode: 204,
        }
      );

      cy.getByTestID('word-list-item-1')
        .findByTestID('delete-word-button')
        .click();
      cy.getByTestID('word-list').should('not.contain', existingWord[0].word);
    });
  });

  context('with fixtures', () => {
    beforeEach(() => {
      // cy.fixture('words.json').as('myWord');
    });
    // it('renders words corectly', () => {
    //   cy.interceptApi('GET', '/words', {
    //     fixture: 'words.json',
    //   });

    //   cy.visit('/cypress/word-list-api');
    //   cy.getByTestID('word-list-item-1').should('have.text', 'Ipsum1');
    //   cy.getByTestID('word-list-item-2').should('have.text', 'Ipsum2');
    //   cy.getByTestID('word-list-item-3').should('have.text', 'Lorem1');
    //   cy.getByTestID('word-list-item-4').should('have.text', 'Lorem2');
    // });

    it('renders word correctly', () => {
      cy.fixture('words.json').then((data) => {
        cy.interceptApi('GET', '/words', data);
        cy.visit('/cypress/word-list-api');
        for (const { id, word } of data.words) {
          cy.getByTestID(`word-list-item-${id}`).should('have.text', word);
        }
      });
    });
  });

  context.only('with in faker', () => {
    const existingWords = _.times(
      faker.datatype.number({ min: 5, max: 10 }),
      (index) => ({
        id: index + 1,
        word: `${faker.lorem.word()}-${index + 1}`,
      })
    );

    beforeEach(() => {
      cy.interceptApi('GET', '/words', { word: existingWords });

      cy.visit('/cypress/word-list-api');
    });

    it('renders word correctly', () => {
      for (const { id, word } of existingWords) {
        cy.getByTestID(`word-list-item-${id}`).should('have.text', word);
      }
    });

    it('addes new word correctly', () => {
      const id = existingWords.length + 1;
      const newWord = {
        id,
        word: `${faker.lorem.word()}-${id}`,
      };

      cy.intercept(
        {
          method: 'POST',
          pathname: '/api/v1/words',
        },
        {
          statusCode: 201,
          body: { word: newWord },
        }
      );

      cy.getByTestID('my-word-input').type(newWord.word);
      cy.getByTestID('add-word-button').click();
      cy.getByTestID(`word-list-item-${id}`).should('have.text', newWord.word);
    });

    it('allows to search keyword correctly', () => {
      const keyword = faker.helpers.arrayElement(existingWords).word;
      const matchedWords = existingWords.filter((word) =>
        word.word.includes(keyword)
      );
      cy.intercept(
        {
          pathname: '/api/v1/words',
          query: { term: keyword },
        },
        {
          words: matchedWords,
        }
      ).as('query');

      cy.getByTestID('search-input').type(keyword);
      cy.wait('@query');
      cy.getByTestID('word-list').find('li').should('have.length', 1);
      cy.getByTestID('word-list').should('contain', keyword);
    });

    it('updates the word correctly', () => {
      const { id } = faker.helpers.arrayElement(existingWords);
      const updateedWord = {
        id,
        word: `${faker.lorem.word()}-${id}`,
      };

      cy.intercept(
        {
          method: 'PATCH',
          pathname: `/api/v1/words/${id}`,
        },
        {
          word: updateedWord,
        }
      );

      cy.getByTestID(`word-list-item-${id}`)
        .findByTestID('edit-word-button')
        .click();
      cy.getByTestID('edit-word-input').clear();
      cy.getByTestID('edit-word-input').type(updateedWord.word);

      cy.getByTestID(`word-list-item-${id}`)
        .findByTestID('edit-word-button')
        .click();
      cy.getByTestID(`word-list-item-${id}`).should(
        'have.text',
        updateedWord.word
      );
    });

    it.only('deletes the word correcly', () => {
      const { id } = faker.helpers.arrayElement(existingWords);

      const deletedWord = existingWords.find((item) => item.id === id);

      cy.intercept(
        {
          method: 'DELETE',
          pathname: `/api/v1/words/${id}`,
        },
        {
          statusCode: 204,
        }
      );

      cy.getByTestID(`word-list-item-${id}`)
        .findByTestID('delete-word-button')
        .click();
      cy.getByTestID('word-list').should('not.contain', deletedWord?.word);
    });
  });
});
