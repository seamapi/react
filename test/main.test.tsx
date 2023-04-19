import { render, screen } from 'fixtures/react.js'

test('render', () => {
  render(<p>Foo</p>)
  expect(screen.findByText('Foo')).toBeTruthy()
})
