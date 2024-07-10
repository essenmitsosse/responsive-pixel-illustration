import { createElement } from 'react'
import WrapperApp from './WrapperApp'
import { BrowserRouter } from 'react-router-dom'

describe('<WrapperApp />', () => {
  it('renders', () => {
    cy.DO_MOUNT_ROUTER()

    /** Make sure image loading is displayed */
    cy.get('body').contains('Bild lädt').should('exist')

    /** Make sure image is fully loaded and rendered */
    cy.get('body').contains('Bild lädt').should('not.exist')
    cy.get('body').contains('Bild rendert').should('not.exist')

    cy.DO_FORCE_DARK_MODE()
    cy.viewport(1024, 800)
    cy.screenshot('main-1024-800-dark-start', { overwrite: true })

    cy.DO_FORCE_LIGHT_MODE()
    cy.viewport(800, 600)

    cy.GET('canvas')
      .trigger('touchstart')
      .trigger('touchmove', {
        touches: [{ clientY: 50, clientX: 105 }],
      })
    cy.screenshot('main-800-600-0-light-hover-top-left', { overwrite: true })

    cy.GET('canvas').trigger('mouseover')
    cy.GET('canvas').trigger('mousemove', 500, 400, { force: true })
    cy.screenshot('main-800-600-1-light-touch-bottom-right', {
      overwrite: true,
    })

    cy.GET('input-size-x').invoke('val', 0.6).trigger('input')
    cy.GET('input-size-y').invoke('val', 0.3).trigger('input')
    cy.screenshot('main-800-600-2-light-change-size-x-via-ui', {
      overwrite: true,
    })

    cy.GET('input-id-image').select('brothers')

    cy.GET('input-size-pixel').invoke('val', 2).trigger('input')
    cy.screenshot('main-800-600-3-light-change-image-and-pixel-size', {
      overwrite: true,
    })
  })
})
