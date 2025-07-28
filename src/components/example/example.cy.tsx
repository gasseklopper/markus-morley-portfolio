import { ExampleTest } from './example'

it('should render ⭐', () => {
  cy.qwikMount(<ExampleTest flag={true} />)
  cy.get('div.icon').should('contain.text', '⭐')
})

it('should render 💣', () => {
  cy.qwikMount(<ExampleTest flag={false} />)
  cy.get('div.icon').should('contain.text', '💣')
})

it('should count clicks', () => {
  cy.qwikMount(<ExampleTest flag={true} />)
  cy.get('span').should('contain.text', 'Count:0')
  cy.get('button').click()
  cy.get('span').should('contain.text', 'Count:1')
})