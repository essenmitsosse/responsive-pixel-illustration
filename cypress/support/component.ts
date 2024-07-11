// ***********************************************************
// This example support/component.ts is processed and
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
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import '../../src/index.css'

import { mount } from 'cypress/react18'
import type { Router } from '@remix-run/router'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import listConfigRouter from '../../src/listConfigRouter'
import { createElement } from 'react'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts the whole app with the real router and takes a path to load.
       */
      readonly DO_MOUNT_ROUTER: (ARGS?: {
        readonly NAME_PATH?: string
      }) => Cypress.Chainable<Router>

      mount: typeof mount
    }
  }
}

Cypress.Commands.add('DO_MOUNT_ROUTER', (ARGS) => {
  const ROUTER_MEMORY = createMemoryRouter(listConfigRouter)

  mount(createElement(RouterProvider, { router: ROUTER_MEMORY }))

  if (ARGS?.NAME_PATH !== undefined) {
    ROUTER_MEMORY.state.location.pathname = ARGS.NAME_PATH
  }

  return cy.wrap(ROUTER_MEMORY, { log: false })
})

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)
