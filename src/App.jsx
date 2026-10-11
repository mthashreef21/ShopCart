import {  } from 'react'
import Navbar from './Layouts/Navbar'
import Home from './Pages/Home'

function App() {

  return (
    <>
      <Navbar />

      <main className='min-h-screen bg-gray-50'>
        <Home/>
      </main>
    </>
  )
}

export default App
