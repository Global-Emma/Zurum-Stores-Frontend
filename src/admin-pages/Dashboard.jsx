// Dashboard.jsx
import './dashboard.css';
import { useEffect } from 'react';
import axios from 'axios';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { useState } from 'react';
import LoadingPopup from '../assets/LoadingPopup';

const Dashboard = ({ token, API_URL }) => {

  const [usersNo, setUsersNo] = useState()
  const [ordersNo, setOrdersNo] = useState()
  const [orders, setOrders] = useState([])
  const [popup, setPopup] = useState(false)
  useEffect(() => {
    setPopup(true)
    axios.get(`${API_URL}/users/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setUsersNo(response.data.noOfUsers)
    })

    axios.get(`${API_URL}/orders/get-orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setOrdersNo(response.data.totalOrders)
      setOrders(response.data.data)
      // console.log(orders)
    })
    setPopup(false)
  }, [token, API_URL])

  // Sample data for stats
  const stats = [
    { id: 1, title: 'Total Users', value: usersNo, change: '+12%', icon: '👥', color: 'blue' },
    { id: 2, title: 'Revenue', value: '$24,580', change: '+8%', icon: '💰', color: 'green' },
    { id: 3, title: 'Orders', value: ordersNo, change: '-3%', icon: '📦', color: 'orange' },
    { id: 4, title: 'Conversion', value: '3.25%', change: '+2%', icon: '📊', color: 'purple' }
  ];


const filtered = orders.filter(order => order.userId.role !== 'admin');

  // Sample chart data
  const revenueData = [60, 80, 45, 90, 70, 85, 65];
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <div className="date-range">
            <span>📅 Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change} from last week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Revenue Overview</h3>
            <select className="chart-filter">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="chart">
            <div className="chart-bars">
              {revenueData.map((value, index) => (
                <div key={index} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{ height: `${(value / maxRevenue) * 100}%` }}
                  ></div>
                  <span className="chart-label">Day {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>User Activity</h3>
            <select className="chart-filter">
              <option>This week</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-segment segment-1"></div>
              <div className="pie-segment segment-2"></div>
              <div className="pie-segment segment-3"></div>
              <div className="pie-center"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color color-1"></span>
                <span>Mobile (45%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-2"></span>
                <span>Desktop (35%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-3"></span>
                <span>Tablet (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h3>Recent Orders</h3>
        </div>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...filtered].reverse().slice(0, 5).map((order) => {
                let price = 0
                order.orderItem.forEach((item) => {
                  price += item.productId.priceCents * item.quantity
                })
                return (
                  <tr key={order._id}>
                    <td className="order-id">{order._id}</td>
                    <td className="customer">{order.userId ? order.userId.username : 'No Name'}</td>
                    <td className="date">{dayjs(order.createdAt).format('MMMM D')}</td>
                    <td className="amount">${(price / 100).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`} >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <h4>Top Products</h4>
          <ul className="product-list">
            <li>
              <span>iPhone 14 Pro</span>
              <span className="product-sales">124 sales</span>
            </li>
            <li>
              <span>MacBook Air</span>
              <span className="product-sales">89 sales</span>
            </li>
            <li>
              <span>AirPods Pro</span>
              <span className="product-sales">76 sales</span>
            </li>
            <li>
              <span>iPad Pro</span>
              <span className="product-sales">54 sales</span>
            </li>
          </ul>
        </div>
        <div className="quick-stat">
          <h4>Recent Activity</h4>
          <ul className="activity-list">
            <li>
              <span className="activity-icon">👤</span>
              <div>
                <p>New user registered</p>
                <span className="activity-time">2 min ago</span>
              </div>
            </li>
            <li>
              <span className="activity-icon">💳</span>
              <div>
                <p>Order #ORD-006 completed</p>
                <span className="activity-time">15 min ago</span>
              </div>
            </li>
            <li>
              <span className="activity-icon">📈</span>
              <div>
                <p>Revenue target achieved</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </li>
            <li>
              <span className="activity-icon">📦</span>
              <div>
                <p>New product added</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {popup && <LoadingPopup />}
    </div>
  );
};

export default Dashboard;