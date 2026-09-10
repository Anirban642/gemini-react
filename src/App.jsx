import { useState } from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'
import Landing from './Components/Landing/Landing'

const App = () => {
  const [showLanding, setShowLanding] = useState(true)

  return (
    showLanding
      ? <Landing onStart={() => setShowLanding(false)} />
      : <div className="app-shell">
          <Sidebar onHome={() => setShowLanding(true)} />
          <Main />
        </div>
  )
}

export default App
