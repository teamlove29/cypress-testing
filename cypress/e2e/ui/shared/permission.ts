import { Role } from 'models/user';

type Permissions = {
  // Admin | Editor | Member
  [K in keyof typeof Role]: boolean;
};
export const checkPermissions = (permissions: Permissions, path: string) => {
  /*
  [
    ['Admin',true],
    ['Editor',false],
    ['Member',false],
  ]

  _.invest(Role) = 1:'Admin' จะกลับกัน
  */
  for (const [roleName, isAllowed] of Object.entries(permissions)) {
    const action = isAllowed ? 'allows' : 'does not allow';

    it(`${action} ${roleName} access ${path} correctly`, () => {
      const role = Role[roleName as keyof Permissions];
      cy.loginAs(role);
      cy.visit('/admin/users');
      cy.getByTestID('flash-message').should('not.exist');
    });
  }
};
