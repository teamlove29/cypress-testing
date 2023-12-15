import { faker } from '@faker-js/faker';
import { PagingOptions, createPaging } from './pagination';

const { _ } = Cypress;

export const Role = {
  Admin: 1,
  Editor: 2,
  Member: 3,
} as const;

export type RoleValue = (typeof Role)[keyof typeof Role];

export type User = {
  id: number;
  name: string;
  avatar: string;
  email?: string;
  role?: RoleValue;
};

export const createUser = (user: Partial<User> = {}) => {
  return {
    id: faker.datatype.number(),
    name: faker.name.findName(),
    avatar: faker.image.imageUrl(),
    email: faker.internet.email(),
    role: faker.helpers.objectValue(Role),
    ...user,
  };
};

export const createUserList = (count?: number, fields: Partial<User> = {}) => {
  const length = count || faker.datatype.number({ min: 5, max: 10 });

  return _.times(length, () => createUser(fields));
};

export const createUsersPagination = (
  pagingOption?: PagingOptions,
  users?: User[]
) => {
  return {
    users: {
      items: users || createUserList(pagingOption?.limit),
      paging: createPaging(pagingOption),
    },
  };
};
