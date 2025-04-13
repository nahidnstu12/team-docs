import './globals.css'
import { AuthProvider } from './providers'

export const metadata = {
  title: 'Documentation Collaboration System',
  description: 'Company documentation collaboration system with workspace, projects, sections and pages',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}