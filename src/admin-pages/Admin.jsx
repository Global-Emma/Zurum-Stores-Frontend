import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { TbShoppingCartCopy } from "react-icons/tb";
import { BsCreditCard2Back } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaBars } from "react-icons/fa";
import Dashboard from './Dashboard';
import AdminOrders from './AdminOrders';
import Customers from './Customers';

const Admin = ({ token, deliveryOptions, API_URL }) => {

  const [active, setActive] = useState('dashboard')
  const [closed, setClosed] = useState(false)

  const menuBar = ['dashboard', 'orders', 'customers'];

  const menuIcons = (box) => {
    switch (box) {
      case 'dashboard':
        return <RxDashboard />;
      case 'orders':
        return <TbShoppingCartCopy />;
      case 'customers':
        return <LuUsers />
    }
  }

  const runActive = (active) => {
    switch (active) {
      case 'dashboard':
        return <Dashboard token={token} runActive={runActive} API_URL={API_URL} />;
      case 'orders':
        return <AdminOrders token={token} deliveryOptions={deliveryOptions} API_URL={API_URL} />;
      case 'customers':
        return <Customers token={token} deliveryOptions={deliveryOptions} API_URL={API_URL} />

      default:
        return <Dashboard />
    }
  }

  return (
    <>
      <div className="admin-container">
        <div className="admin-menu">
          <div className="menu-header">
            <FaBars id="bars" onClick={() => {
              document.querySelector('.admin-display').style.flexGrow = '5'
              document.querySelector('.admin-menu').style.flexGrow = '.5'
              setClosed(false)
            }} />
            <h2 className={closed === true ? 'closed' : 'opened'}>Menu</h2>
            <FaArrowLeft className={closed === true ? 'closed' : 'opened'} onClick={() => {
              document.querySelector('.admin-display').style.flexGrow = '10'
              document.querySelector('.admin-menu').style.flexGrow = '0'
              setClosed(true)
            }} />
          </div>

          <div className="menu-bars-container">
            {menuBar.map((menu, index) => {
              return (
                <div key={index} className={menu === active ? 'menu-bars active-menu' : 'menu-bars'} onClick={() => {
                  setActive(menu)
                }}>

                  {menuIcons(menu)}
                  <p className={closed === true ? 'closed' : 'opened'}>{menu.charAt(0).toUpperCase() + menu.slice(1)}</p>
                </div>
              )
            })}

          </div>
        </div>
        <div className="admin-display">
          {
            runActive(active)
          }
        </div>
      </div>
    </>
  )
}

export default Admin