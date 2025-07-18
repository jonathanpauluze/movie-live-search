import { Header } from './components/header'
import Home from '@/pages/home'
import { useTheme } from './hooks/use-theme'

function App() {
  useTheme()

  return (
    <div>
      <Header />
      <Home />
    </div>
  )
}

export default App
