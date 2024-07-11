import failOnConsoleError from 'cypress-fail-on-console-error'

failOnConsoleError({
  consoleTypes: ['error', 'warn', 'info'],
  debug: true,
})

const DO_FORCE_COLOR_SCHEME = (
  ID_MODE: 'DARK' | 'LIGHT',
): Cypress.Chainable<void> => {
  Cypress.log({
    displayName: 'CHANGING COLOR SCHEME',
    message: ID_MODE,
    name: 'DO_FORCE_COLOR_SCHEME',
  })

  return cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        features: [{ name: 'prefers-color-scheme', value: ID_MODE }],
        media: 'page',
      },
    }),
    { log: false },
  )
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Simulates the users browser expecting dark mode */
      readonly DO_FORCE_DARK_MODE: () => Cypress.Chainable<void>

      /** Simulates the users browser expecting light mode */
      readonly DO_FORCE_LIGHT_MODE: () => Cypress.Chainable<void>

      /** Similar to {@link cy.get}, but always selects by `data-test` attribute. */
      readonly GET: (
        NAME_SELECTOR: string,
        // eslint-disable-next-line no-undef -- false negative on `JQuery`
      ) => Cypress.Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add(
  'DO_FORCE_DARK_MODE',

  (): Cypress.Chainable<void> => DO_FORCE_COLOR_SCHEME('DARK'),
)

Cypress.Commands.add(
  'DO_FORCE_LIGHT_MODE',

  (): Cypress.Chainable<void> => DO_FORCE_COLOR_SCHEME('LIGHT'),
)

Cypress.Commands.add(
  'GET',
  // eslint-disable-next-line no-undef -- false negative on `JQuery`
  (NAME_SELECTOR: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(`[data-test=${NAME_SELECTOR}]`),
)
