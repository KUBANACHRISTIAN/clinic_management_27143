import { useState } from 'react'
import Office from './assets/components/Office.jsx'
import AvailableOffices from './assets/components/AvailableOffices.jsx'
import './App.css'

function App() {
  const [page, setPage] = useState('offices')

  return (
    <>
      <nav className="nav">
        <button
          type="button"
          className={page === 'offices' ? 'active' : ''}
          onClick={() => setPage('offices')}
        >
          Available Offices
        </button>
        <button
          type="button"
          className={page === 'save' ? 'active' : ''}
          onClick={() => setPage('save')}
        >
          Save office
        </button>
      </nav>

      {page === 'offices' ? <AvailableOffices /> : <Office />}
    </>
  )
}

export default App
