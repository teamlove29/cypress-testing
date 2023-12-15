import { faker } from '@faker-js/faker';
import { Article, createArticle } from './article';
import { Category, createCategory } from './category';
import { User, createUser } from './user';
import { PagingOptions, createPaging } from './pagination';
const { _ } = Cypress;

export type ArticleDetails = Article & {
  user: User;
  category: Category;
};

export const createArticleDetails = (
  articleDetails: Partial<ArticleDetails> = {}
) => {
  const { user, category, ...article } = articleDetails;
  return {
    ...createArticle(article),
    user: createUser(user),
    category: createCategory(category),
  };
};

export const createArticleDetailsList = (
  count?: number,
  fields: Partial<ArticleDetails> = {}
) => {
  const length = count || faker.datatype.number({ min: 5, max: 10 });
  return _.times(length, () => createArticleDetails(fields));
};

export const createArticlesPagination = (
  articleDetails?: ArticleDetails[],
  pagingOptions?: PagingOptions
) => {
  return {
    articles: {
      items: articleDetails || createArticleDetailsList(pagingOptions?.limit),
      paging: createPaging(pagingOptions),
    },
  };
};
