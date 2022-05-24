describe('Home Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('test-header', () => {
    cy.get('header')
  })
})
