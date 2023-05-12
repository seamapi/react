import { render, screen } from 'fixtures/react.js'

test('render', async () => {
  render(<p>Foo</p>)
  await screen.findByText('Foo')
})
