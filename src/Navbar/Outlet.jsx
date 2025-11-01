import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
const Layout = () => {
  return (
    <div>
        <Header/>
      
        <Outlet/>
        <br />
      
      
    </div>
  )
}

export default Layout
