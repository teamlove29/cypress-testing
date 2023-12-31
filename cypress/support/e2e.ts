// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-file-upload';
import 'cypress-intercept-formdata';
import '@testing-library/cypress/add-commands';
import { configure } from '@testing-library/cypress';

// configure({ throwSuggestions: true });

// Alternatively you can use CommonJS syntax:
// require('./commands');
// require('cypress-file-upload');
// require('cypress-intercept-formdata');

// npm i -D @testing-library/cypress
// import '@testing-library/cypress/add-commands';
// config in tsconfig.json
/*
{
    "types": ["node", "cypress", "@testing-library/cypress"],
}
*/
