describe('Home page', () => {
  it('loads successfully', () => {
    cy.visit('/')
    cy.contains("Can't wait to see what you build with qwik!").should('be.visible')
  })
})
