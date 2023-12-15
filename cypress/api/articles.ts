import {
  ArticleDetails,
  createArticlesPagination,
} from 'models/article-details';
import { PagingOptions } from 'models/pagination';
import * as queryString from 'query-string';
const { _ } = Cypress;

export type FilterOptions = Partial<{
  term: string;
  categoryId: number;
  page: number;
}>;

export const mockGetArticles = (
  params: FilterOptions = {},
  paging?: PagingOptions,
  articleDetailsList?: ArticleDetails[]
) => {
  const query = queryString.stringify(
    _.omit(params, params.page === 1 ? 'page' : '')
  );

  const url = `/articles${query ? `?${query}` : ''}`;
  const response = createArticlesPagination(articleDetailsList, paging);

  return { url, response, mocked: cy.interceptApi('GET', url, response) };
};
