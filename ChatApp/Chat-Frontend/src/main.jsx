import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import AppContext from './context/AppContext.jsx'
import { Provider } from 'react-redux'
import chatStore from './store/index.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContext>
      <Provider store={chatStore}>
        <App />
      </Provider>
    </AppContext>
  </BrowserRouter>
)
