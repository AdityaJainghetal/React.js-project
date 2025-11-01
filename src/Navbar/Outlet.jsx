import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <Header/>
        <br />
        <Outlet/>

      
    </div>
  )
}

export default Layout
