// Orders.jsx
import React, { useEffect, useState } from 'react';
import './adminOrders.css';
import axios from 'axios';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import LoadingPopup from '../assets/LoadingPopup';

const AdminOrders = ({ token, deliveryOptions, API_URL }) => {

  const [refresh, setRefresh] = useState(0)
  const [ordersNo, setOrdersNo] = useState()
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [popup, setPopup] = useState(false)
  useEffect(() => {
    setPopup(true)
    axios.get(`${API_URL}/orders/get-orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setOrdersNo(response.data.totalOrders)
      setOrders(response.data.data)
    })
    setPopup(false)
  }, [token, orders, ordersNo, API_URL])

  // Sample orders data
  // const initialOrders = [
  //   { 
  //     id: 'ORD-001', 
  //     customer: 'John Doe', 
  //     email: 'john@example.com',
  //     date: '2024-01-15', 
  //     amount: '$245.00', 
  //     status: 'completed',
  //     payment: 'Paid',
  //     items: 3
  //   },
  //   { 
  //     id: 'ORD-002', 
  //     customer: 'Jane Smith', 
  //     email: 'jane@example.com',
  //     date: '2024-01-14', 
  //     amount: '$128.50', 
  //     status: 'processing',
  //     payment: 'Paid',
  //     items: 2
  //   },
  //   { 
  //     id: 'ORD-003', 
  //     customer: 'Bob Johnson', 
  //     email: 'bob@example.com',
  //     date: '2024-01-14', 
  //     amount: '$89.99', 
  //     status: 'pending',
  //     payment: 'Pending',
  //     items: 1
  //   },
  //   { 
  //     id: 'ORD-004', 
  //     customer: 'Alice Brown', 
  //     email: 'alice@example.com',
  //     date: '2024-01-13', 
  //     amount: '$456.00', 
  //     status: 'completed',
  //     payment: 'Paid',
  //     items: 5
  //   },
  //   { 
  //     id: 'ORD-005', 
  //     customer: 'Charlie Wilson', 
  //     email: 'charlie@example.com',
  //     date: '2024-01-13', 
  //     amount: '$67.80', 
  //     status: 'shipped',
  //     payment: 'Paid',
  //     items: 2
  //   },
  //   { 
  //     id: 'ORD-006', 
  //     customer: 'Emma Davis', 
  //     email: 'emma@example.com',
  //     date: '2024-01-12', 
  //     amount: '$324.50', 
  //     status: 'processing',
  //     payment: 'Paid',
  //     items: 4
  //   },
  //   { 
  //     id: 'ORD-007', 
  //     customer: 'Michael Lee', 
  //     email: 'michael@example.com',
  //     date: '2024-01-11', 
  //     amount: '$199.99', 
  //     status: 'completed',
  //     payment: 'Paid',
  //     items: 3
  //   },
  //   { 
  //     id: 'ORD-008', 
  //     customer: 'Sarah Miller', 
  //     email: 'sarah@example.com',
  //     date: '2024-01-10', 
  //     amount: '$550.00', 
  //     status: 'cancelled',
  //     payment: 'Refunded',
  //     items: 6
  //   }
  // ];



  // Filter orders based on search and filters
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId && order.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    // Date filtering logic (simplified)
    const matchesDate = dateFilter === 'all' || true; // Add actual date filtering logic

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  let totalPrice = 0

  orders.forEach((order) => {
    order.orderItem.forEach((item) => {
      totalPrice += item.productId.priceCents * item.quantity
    })
  })

  // Handle order selection
  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    switch (action) {
      case 'delete':
        selectedOrders.forEach(async order => {
          setPopup(true)
          await axios.delete(`${API_URL}/orders/delete-order/${order}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          setPopup(false)
        });
        setSelectedOrders([]);
        break;
      case 'mark_confirmed':
        selectedOrders.forEach(async order => {
          setPopup(true)
          await axios.put(`${API_URL}/orders/update-order`, { id: order },
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
            }
          )
          setPopup(false)
        });
        setSelectedOrders([]);
        break;
      default:
        break;
    }
  };

  // Handle single order actions
  const handleOrderAction = (orderId, action) => {
    switch (action) {
      case 'view':
        // Navigate to order details
        console.log('View order:', orderId);
        break;
      case 'edit':
        // Edit order
        console.log('Edit order:', orderId);
        break;
      case 'delete':
        setOrders(orders.filter(order => order.id !== orderId));
        break;
      default:
        break;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'delivered': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'shipped': return '#8b5cf6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'delivered': return '🔄';
      case 'pending': return '⏳';
      case 'shipped': return '🚚';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="orders-content">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>Orders Management</h1>
          <p className="subtitle">Manage and track customer orders</p>
        </div>
        <button className="add-order-btn">
          + Add New Order
        </button>
      </div>

      {/* Stats Overview */}
      <div className="order-stats-grid">
        <div className="order-stat-card">
          <div className="order-stat-icon">📦</div>
          <div>
            <h3>Total Orders</h3>
            <div className="order-stat-value">{orderStats.total}</div>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-icon completed">✅</div>
          <div>
            <h3>Confirmed</h3>
            <div className="order-stat-value">{orderStats.confirmed}</div>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-icon processing">🔄</div>
          <div>
            <h3>delivered</h3>
            <div className="order-stat-value">{orderStats.delivered}</div>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-icon pending">⏳</div>
          <div>
            <h3>Pending</h3>
            <div className="order-stat-value">{orderStats.pending}</div>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-icon cancelled">❌</div>
          <div>
            <h3>Cancelled</h3>
            <div className="order-stat-value">{orderStats.cancelled}</div>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="order-stat-icon shipped">🚚</div>
          <div>
            <h3>Shipped</h3>
            <div className="order-stat-value">{orderStats.shipped}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders by ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🏷️ Grid
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedOrders.length} order(s) selected</span>
          <div className="bulk-buttons">
            <button
              className="bulk-btn"
              onClick={async () => await handleBulkAction('mark_confirmed')}
            >
              Mark as Confirmed
            </button>
            <button
              className="bulk-btn delete"
              onClick={() => handleBulkAction('delete')}
            >
              Delete Selected
            </button>
            <button
              className="bulk-btn cancel"
              onClick={() => setSelectedOrders([])}
            >
              Cancel Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredOrders].reverse().map((order) => {
                let price = 0
                let delivery = 0

                order.orderItem.forEach((item) => {
                  price += item.productId.priceCents * item.quantity
                  const selectedDeliveryOptions = deliveryOptions.find((option) => {
                    return option.id === item.deliveryOptionsId
                  })
                  delivery += selectedDeliveryOptions.priceCents
                })
                return (
                  <tr key={order._id} className="order-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleOrderSelection(order._id)}
                      />
                    </td>
                    <td className="order-id">
                      <strong>{order._id}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.userId ? order.userId.username : 'No Name'}</div>
                        <div className="customer-email">{order.userId ? order.userId.email : 'No mail'}</div>
                      </div>
                    </td>
                    <td className="order-date">{dayjs(order.createdAt).format('MMMM D')}</td>
                    <td className="order-amount">
                      <strong>${((price + delivery) / 100).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="items-count">
                        {order.items} item{order.items !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <div className="order-actions">
                        <button
                          className="action-btn view"
                          onClick={() => handleOrderAction(order.id, 'view')}
                          title="View Order"
                        >
                          👁️
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleOrderAction(order.id, 'edit')}
                          title="Edit Order"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={
                            async () => {
                              setPopup(true)
                              await axios.delete(`${API_URL}/orders/delete-order/${order._id}`, {
                                headers: {
                                  Authorization: `Bearer ${token}`
                                }
                              })

                              setRefresh(refresh + 1)
                              setPopup(false)
                            }}
                          title="Delete Order"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            let price = 0
            let delivery = 0
            let totalItems = 0

            order.orderItem.forEach((item) => {
              price += item.productId.priceCents * item.quantity
              const selectedDeliveryOptions = deliveryOptions.find((option) => {
                return option.id === item.deliveryOptionsId
              })
              delivery += selectedDeliveryOptions.priceCents
              totalItems += item.quantity
            })
            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleOrderSelection(order._id)}
                    />
                  </div>
                  <div className="order-card-id">{order._id}</div>
                  <div className="order-card-date">{dayjs(order.createdAt).format('MMMM d')}</div>
                </div>

                <div className="order-card-body">
                  <div className="order-customer">
                    <div className="customer-avatar">
                    </div>
                    <div>
                      <h4>{order.userId ? order.userId.username : 'No Name'}</h4>
                      <p>{order.userId ? order.userId.email : 'No Email'}</p>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="order-detail">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">{((price + delivery) / 100).toFixed(2)}</span>
                    </div>
                    <div className="order-detail">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">{totalItems}</span>
                    </div>
                    <div className="order-detail">
                      <span className="detail-label">Payment:</span>
                      <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>

                  <div className="order-card-actions">
                    <button
                      className="action-btn view"
                      onClick={() => handleOrderAction(order._id, 'view')}
                    >
                      View
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleOrderAction(order._id, 'edit')}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Orders Summary */}
      <div className="orders-summary">
        <div className="summary-card">
          <h3>Orders Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span>Total Revenue:</span>
              <strong>$1,862.78</strong>
            </div>
            <div className="summary-stat">
              <span>Avg Order Value:</span>
              <strong>${(totalPrice / 100).toFixed(2)}</strong>
            </div>
            <div className="summary-stat">
              <span>Orders This Month:</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="summary-stat">
              <span>Conversion Rate:</span>
              <strong>3.2%</strong>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3>Export Options</h3>
          <div className="export-buttons">
            <button className="export-btn csv">📊 Export as CSV</button>
            <button className="export-btn pdf">📄 Export as PDF</button>
            <button className="export-btn print">🖨️ Print Orders</button>
          </div>
        </div>
      </div>

      {popup && <LoadingPopup />}
    </div>
  );
};

export default AdminOrders;