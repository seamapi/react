import '@seamapi/react/index.css'

export const metadata = {
  title: 'Supported devices',
  description:
    'Explore supported devices, capabilities, and integration requirements.',
}

export default function Layout({ children }) {
  return (
    <html lang='en'>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
