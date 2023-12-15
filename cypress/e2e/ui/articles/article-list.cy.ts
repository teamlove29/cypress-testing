import { faker } from '@faker-js/faker';
import { FilterOptions, mockGetArticles } from 'api/articles';
import { mockGetCategories } from 'api/categories';
import {
  ArticleDetails,
  PagingOptions,
  createArticleDetailsList,
} from 'models/article-details';

const renderArticleListPage = (
  params?: FilterOptions,
  paging?: PagingOptions
) => {
  const {
    response: {
      articles: { items: articles },
    },
  } = mockGetArticles(params, paging);

  mockGetCategories();

  cy.visit('/articles');

  return articles;
};

const checkArticleList = (articles: ArticleDetails[]) => {
  cy.getByTestID('article-item').each(($element, index) => {
    const { title, image, excerpt, user, category } = articles[index];
    cy.wrap($element).within(() => {
      cy.getByTestID('article-item-title').contains(title);
      cy.getByTestID('article-item-image').should(
        'have.css',
        'background-image',
        `url("${image}")`
      );
      cy.getByTestID('article-item-excerpt').contains(excerpt);
      cy.getByTestID('article-item-user-name').contains(user.name);
      cy.getByTestID('article-item-user-avatar').should(
        'have.attr',
        'src',
        user.avatar
      );
      cy.getByTestID('article-item-category-name').contains(category.name);
    });
  });
};

describe('Article List UI', () => {
  it('renders article list correctly', () => {
    const articles = renderArticleListPage();

    cy.get('h1').contains('Article');
    checkArticleList(articles);
  });

  it('renders article list search query correctly', () => {
    // สร้างคำค้นหาด้วย faker.lorem.word()
    const term = faker.lorem.word('term');
    /*
      สร้าง expectedArticleList โดยกำหนด title ให้เป็นคำค้นหาที่สร้างขึ้นมา
      โดยใช้ createArticleDetailsList()
    */
    const expectedArticleList = createArticleDetailsList(undefined, {
      title: `${faker.lorem.word()} ${term} ${faker.lorem.word()}`,
    });

    // จำลองการเรียกข้อมูลบทความจาก server ด้วยคำค้นหาที่สร้างขึ้นมา
    mockGetArticles({ term }, undefined, expectedArticleList).mocked.as(
      'loadArticlesWithQeurt'
    );

    // เรียกใช้งานฟังก์ชัน renderArticleListPage() เพื่อแสดงหน้าเว็บ
    renderArticleListPage();

    // พิมพคำค้นหา
    cy.getByTestID('articlie-list-search-input').type(term);

    // รอให้ข้อมูลโหลดเสร็จ
    cy.wait('@loadArticlesWithQeurt');

    // ตรวจสอบผลลัพธ์ที่แสดงออกมาว่าตรงกับ expectedArticleList หรือไม่
    checkArticleList(expectedArticleList);
  });

  it('handles pagination correctly', () => {
    // สร้างจำนวนหน้าทั้งหมดด้วย faker.datatype.number() และกำหนดเป็นตัวแปร totalPages
    const totalPages = faker.datatype.number({ min: 3, max: 5 });

    // เรียกใช้งานฟังก์ชัน renderArticleListPage() เพื่อแสดงหน้าเว็บ
    renderArticleListPage(undefined, {
      totalPages,
    });

    // ตรวจสอบว่า URL ถูกต้องหรือไม่
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/articles');
      expect(location.search).to.eq('');
    });

    // ตรวจสอบว่าปุ่มหน้าที่แรกถูก disable หรือไม่
    cy.getByTestID('article-list-pagination').within(() => {
      cy.get('li:first-child > button').should('be.disabled');
    });

    // ทำการ loop เพื่อเลือกหน้าที่ต่างๆ
    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      // จำลองการเรียกข้อมูลบทความจาก server ด้วยคำค้นหาที่สร้างขึ้นมา
      mockGetArticles({ page: currentPage }, { page: currentPage, totalPages });

      // คลิกเพื่อเลือกหน้า
      cy.getByTestID('article-list-pagination').contains(currentPage).click();

      // ตรวจสอบว่า URL ถูกต้องหรือไม่
      cy.location().should((location) => {
        expect(location.pathname).to.eq('/articles');
        expect(location.search).to.eq(`?page=${currentPage}`);
      });

      // ตรวจสอบว่าปุ่มหน้าที่ถูกคลิกมีค่า aria-current เป็น 'true' หรือไม่
      cy.getByTestID('article-list-pagination').within(() => {
        cy.get(`li:nth-child(${currentPage + 1}) > button`).should(
          'have.attr',
          'aria-current',
          'true'
        );
      });

      // ตรวจสอบว่าปุ่มหน้าสุดท้ายถูก disable หรือไม่
      if (currentPage === totalPages) {
        cy.get('li:last-child > button').should('be.disabled');
      }
    }
  });
});
