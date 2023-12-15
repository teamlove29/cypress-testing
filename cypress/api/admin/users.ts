import { PagingOptions } from 'models/pagination';
import { User, createUser, createUsersPagination } from 'models/user';
import * as queryString from 'query-string';
import { interceptApi } from 'support/commands';

const { _ } = Cypress;

export type FilterOptions = {
  term?: string;
};

export const mockGetAllUsers = (
  filterOption?: FilterOptions,
  paging?: PagingOptions,
  users?: User[]
) => {
  // ถ้า paging เหมือน ...paging โดยกำหนดตัวแปลไว้ตอนแรก
  const pagingWithDefaultValue = _.merge(
    { limit: 12, page: 1 },
    paging,
    filterOption
  );
  const query = queryString.stringify(pagingWithDefaultValue);
  const url = `/users${query ? `?${query}` : ''}`;
  const response = createUsersPagination(paging, users);
  return {
    url,
    response,
    mocked: interceptApi('GET', url, response),
  };
};

export const mockGetUser = (id: number, model?: Partial<User>) => {
  const url = `/users/${id}`;
  const user = createUser({ id, ...model });

  return {
    url,
    response: user,
    mocked: interceptApi('GET', url, { user }),
  };
};

export const mockUpdateUser = (id: number, model?: Partial<User>) => {
  const url = `/users/${id}`;
  const user = createUser({ id, ...model });

  return {
    url,
    response: user,
    mocked: interceptApi('PATCH', url, { user }),
  };
};

export const mockDeleteUser = (id: number) => {
  const url = `/users/${id}`;
  const response = { statusCode: 204 };

  return {
    url,
    response,
    mocked: interceptApi('DELETE', url, response),
  };
};
