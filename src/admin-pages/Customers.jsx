// Customers.jsx
import React, { useEffect, useState } from 'react';
import './customers.css';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import LoadingPopup from '../assets/LoadingPopup';

const Customers = ({ token, deliveryOptions, API_URL }) => {


  const [refresh, setRefresh] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const [popup, setPopup] = useState(false)

  useEffect(() => {
    setPopup(true)
    axios.get(`${API_URL}/users/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setCustomers(response.data.data)
    })
    setPopup(false)
  }, [token, API_URL])



  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const onlyUsers = customer.role === 'user'
      const matchesSearch =
        customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      // customer.phone.includes(searchTerm) ||
      // customer.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

      return matchesSearch && matchesStatus && onlyUsers;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'orders':
          aValue = a.orders;
          bValue = b.orders;
          break;
        case 'totalSpent':
          aValue = parseFloat(a.orderIds.order.replace('$', '').replace(',', ''));
          bValue = parseFloat(b.totalSpent.replace('$', '').replace(',', ''));
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const sortCustomers = customers.map((customer) => {
    const totalSpent = customer.orderIds.reduce((sum, order) => {
      const orderTotal = order.orderItem.reduce((itemSum, item) => {
        return itemSum + item.productId.priceCents * item.quantity
      }, 0);
      return sum + orderTotal;
    }, 0);

    const totalDelivery = customer.orderIds.reduce((sum, order) => {
      const orderDelivery = order.orderItem.reduce((itemSum, item) => {
        const selectedDeliveryOptions = deliveryOptions.find((option) => {
          return option.id === item.deliveryOptionsId
        })
        return itemSum + selectedDeliveryOptions.priceCents
      }, 0);
      return sum + orderDelivery;
    }, 0);

    return { totalSpent, totalDelivery, ...customer };
  })

  const topCustomers = sortCustomers.sort((a, b) => (b.totalSpent + b.totalDelivery) - (a.totalSpent + a.totalDelivery))

  // Calculate customer statistics
  const customerStats = {
    total: filteredCustomers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    // totalRevenue: customers.reduce((sum, c) => sum + parseFloat(c.totalSpent.replace('$', '').replace(',', '')), 0).toFixed(2),
    // avgOrderValue: price
  };

  // Handle customer selection
  const toggleCustomerSelection = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)));
        setSelectedCustomers([]);
        break;
      case 'export':
        // Export selected customers
        console.log('Exporting customers:', selectedCustomers);
        break;
      case 'sendEmail':
        // Send email to selected customers
        console.log('Sending email to customers:', selectedCustomers);
        break;
      default:
        break;
    }
  };

  // Handle single customer actions
  const handleCustomerAction = (customerId, action) => {
    switch (action) {
      case 'view':
        // Navigate to customer details
        console.log('View customer:', customerId);
        break;
      case 'edit':
        // Edit customer
        console.log('Edit customer:', customerId);
        break;
      case 'delete':
        setCustomers(customers.filter(customer => customer.id !== customerId));
        break;
      case 'toggleStatus':
        setCustomers(customers.map(customer =>
          customer.id === customerId
            ? { ...customer, status: customer.status === 'active' ? 'inactive' : 'active' }
            : customer
        ));
        break;
      default:
        break;
    }
  };

  // Handle add new customer
  // const handleAddCustomer = () => {
  //   if (!newCustomer.name || !newCustomer.email) {
  //     alert('Please fill in required fields');
  //     return;
  //   }

  //   const newCustomerObj = {
  //     id: customers.length + 1,
  //     name: newCustomer.name,
  //     email: newCustomer.email,
  //     phone: newCustomer.phone || 'N/A',
  //     joinDate: new Date().toISOString().split('T')[0],
  //     orders: 0,
  //     totalSpent: '$0.00',
  //     status: 'active',
  //     location: newCustomer.location || 'Not specified',
  //     avatar: newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()
  //   };

  //   setCustomers([newCustomerObj, ...customers]);
  //   setNewCustomer({ name: '', email: '', phone: '', location: '' });
  //   setShowAddCustomer(false);
  // };

  // Get status color

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'vip': return '#8b5cf6';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // // Get status icon
  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case 'active': return '✅';
  //     case 'vip': return '⭐';
  //     case 'inactive': return '⏸️';
  //     default: return '👤';
  //   }
  // };

  // Sort handler
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="customers-content">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1>Customer Management</h1>
          <p className="subtitle">Manage your customer base and track customer activity</p>
        </div>
        <div className="header-actions">
          <button
            className="export-btn"
            onClick={() => handleBulkAction('export')}
          >
            📊 Export Data
          </button>
          <button
            className="add-customer-btn"
            onClick={() => setShowAddCustomer(true)}>
            + Add New Customer
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="customer-stats-grid">
        <div className="customer-stat-card total">
          <div className="customer-stat-icon">👥</div>
          <div>
            <h3>Total Customers</h3>
            <div className="customer-stat-value">{customerStats.total}</div>
          </div>
        </div>
        <div className="customer-stat-card active">
          <div className="customer-stat-icon">✅</div>
          <div>
            <h3>Active Customers</h3>
            <div className="customer-stat-value">{customerStats.active}</div>
          </div>
        </div>
        <div className="customer-stat-card vip">
          <div className="customer-stat-icon">⭐</div>
          <div>
            <h3>VIP Customers</h3>
            <div className="customer-stat-value">{customerStats.vip}</div>
          </div>
        </div>
        <div className="customer-stat-card revenue">
          <div className="customer-stat-icon">💰</div>
          <div>
            <h3>Total Revenue</h3>
            <div className="customer-stat-value">${customerStats.totalRevenue}</div>
          </div>
        </div>
        <div className="customer-stat-card avg">
          <div className="customer-stat-icon">📊</div>
          <div>
            <h3>Avg Order Value</h3>
            <div className="customer-stat-value">${customerStats.avgOrderValue}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customers-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers by name, email, phone, or location..."
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
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="joinDate">Sort by: Join Date</option>
            <option value="name">Sort by: Name</option>
            <option value="orders">Sort by: Orders</option>
            <option value="totalSpent">Sort by: Total Spent</option>
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

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button
                className="close-modal"
                onClick={() => setShowAddCustomer(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  placeholder="Enter Customer First Name"
                  value={newCustomer.firstname}
                  onChange={(e) => setNewCustomer({ ...newCustomer, firstname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  placeholder="Enter Customer Last Name"
                  value={newCustomer.lastname}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  placeholder="Enter Customer User Name"
                  value={newCustomer.username}
                  onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  placeholder="Enter password"
                  value={newCustomer.password}
                  onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={
                  async () => {
                    setPopup(true)
                    const response = await axios.post(`${API_URL}/users/sign-up`, {
                      firstname: newCustomer.firstname,
                      lastname: newCustomer.lastname,
                      phone: newCustomer.phone,
                      username: newCustomer.username,
                      email: newCustomer.email,
                      password: newCustomer.password

                    })
                    if (response.data.message === 'New User Signed Up SuccessFully') {
                      alert('New Customer Created Successfully')
                      setShowAddCustomer(false)
                    }

                    setRefresh(refresh + 1)
                    setPopup(false)
                  }}
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Bulk Actions */}
      {
        selectedCustomers.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedCustomers.length} customer(s) selected</span>
            <div className="bulk-buttons">
              <button
                className="bulk-btn email"
                onClick={() => handleBulkAction('sendEmail')}
              >
                ✉️ Send Email
              </button>
              <button
                className="bulk-btn export"
                onClick={() => handleBulkAction('export')}
              >
                📥 Export Selected
              </button>
              <button
                className="bulk-btn delete"
                onClick={() => handleBulkAction('delete')}
              >
                🗑️ Delete Selected
              </button>
              <button
                className="bulk-btn cancel"
                onClick={() => setSelectedCustomers([])}
              >
                Cancel Selection
              </button>
            </div>
          </div>
        )
      }

      {/* Customers Display */}
      {
        viewMode === 'table' ? (
          /* Table View */
          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers(filteredCustomers.map(customer => customer.id));
                        } else {
                          setSelectedCustomers([]);
                        }
                      }}
                    />
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Customer {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Contact Info</th>
                  <th onClick={() => handleSort('joinDate')} className="sortable">
                    Join Date {sortBy === 'joinDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('orders')} className="sortable">
                    Orders {sortBy === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('totalSpent')} className="sortable">
                    Total Spent {sortBy === 'totalSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const totalSpent = customer.orderIds.reduce((sum, order) => {
                    const orderTotal = order.orderItem.reduce((itemSum, item) => {
                      return itemSum + item.productId.priceCents * item.quantity
                    }, 0);
                    return sum + orderTotal;
                  }, 0);

                  const totalDelivery = customer.orderIds.reduce((sum, order) => {
                    const orderDelivery = order.orderItem.reduce((itemSum, item) => {
                      const selectedDeliveryOptions = deliveryOptions.find((option) => {
                        return option.id === item.deliveryOptionsId
                      })
                      return itemSum + selectedDeliveryOptions.priceCents
                    }, 0);
                    return sum + orderDelivery;
                  }, 0);


                  return (
                    <tr key={customer._id} className="customer-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer._id)}
                          onChange={() => toggleCustomerSelection(customer._id)}
                        />
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <FaUser className='user-icons' />
                          </div>
                          <div>
                            <div className="customer-name">{customer.username}</div>
                            <div className="customer-location">{customer.address ? `${customer.address.city}, ${customer.address.state}` : 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="customer-email">{customer.email}</div>
                          <div className="customer-phone">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="join-date">{dayjs(customer.createdAt).format('MMMM D')}</td>
                      <td>
                        <div className="orders-count">
                          <span className="count-number">{customer.orderIds.length}</span>
                          <span className="count-label">orders</span>
                        </div>
                      </td>
                      <td className="total-spent">
                        <strong>{((totalSpent + totalDelivery) / 100).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="customer-actions">
                          <button
                            className="action-btn view"
                            onClick={() => handleCustomerAction(customer.id, 'view')}
                            title="View Profile"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => handleCustomerAction(customer.id, 'edit')}
                            title="Edit Customer"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn status"
                            onClick={() => handleCustomerAction(customer.id, 'toggleStatus')}
                            title="Toggle Status"
                          >
                            {customer.status === 'active' ? '⏸️' : '✅'}
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleCustomerAction(customer.id, 'delete')}
                            title="Delete Customer"
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
          <div className="customers-grid">
            {filteredCustomers.map((customer) => {
              const totalSpent = customer.orderIds.reduce((sum, order) => {
                const orderTotal = order.orderItem.reduce((itemSum, item) => {
                  return itemSum + item.productId.priceCents * item.quantity
                }, 0);
                return sum + orderTotal;
              }, 0);

              const totalDelivery = customer.orderIds.reduce((sum, order) => {
                const orderDelivery = order.orderItem.reduce((itemSum, item) => {
                  const selectedDeliveryOptions = deliveryOptions.find((option) => {
                    return option.id === item.deliveryOptionsId
                  })
                  return itemSum + selectedDeliveryOptions.priceCents
                }, 0);
                return sum + orderDelivery;
              }, 0);

              return (
                <div key={customer._id} className="customer-card">
                  <div className="customer-card-header">
                    <div className="customer-card-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => toggleCustomerSelection(customer._id)}
                      />
                    </div>
                    <div className="customer-card-status">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(customer.status) }}
                      ></span>
                      {customer.status}
                    </div>
                  </div>

                  <div className="customer-card-body">
                    <div className="customer-avatar-large">
                      <FaUser className='user-icons' />
                    </div>

                    <h3 className="customer-card-name">{customer.username}</h3>
                    <p className="customer-card-email">{customer.email}</p>
                    <p className="customer-card-location">📍 {customer.address ? `${customer.address.city}, ${customer.address.state}` : 'N/A'}</p>
                    <p className="customer-card-phone">📞 {customer.phone}</p>

                    <div className="customer-card-stats">
                      <div className="customer-stat">
                        <span className="stat-label">Orders</span>
                        <span className="stat-value">{customer.orderIds.length}</span>
                      </div>
                      <div className="customer-stat">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value">{((totalSpent + totalDelivery) / 100).toFixed(2)}</span>
                      </div>
                      <div className="customer-stat">
                        <span className="stat-label">Member Since</span>
                        <span className="stat-value">{dayjs(customer.createdAt).format('MMMM D')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="customer-card-footer">
                    <div className="customer-card-actions">
                      <button
                        className="card-action-btn view"
                        onClick={() => handleCustomerAction(customer.id, 'view')}
                      >
                        View Profile
                      </button>
                      <button
                        className="card-action-btn message"
                        onClick={() => handleCustomerAction(customer.id, 'sendEmail')}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      {/* Customer Insights */}
      <div className="customer-insights">

        <div className="insight-card">
          <h3>Top Customers</h3>
          <div className="top-customers-list">
            {[...topCustomers].slice(0, 5).map(customer => {

              return (
                <div key={customer._id} className="top-customer">
                  <div className="top-customer-info">
                    <div className="top-customer-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h4>{customer.username}</h4>
                      <p>${
                        ((customer.totalSpent + customer.totalDelivery) / 100).toFixed(2)
                      }
                      </p>
                    </div>
                  </div>
                  <span className="top-customer-rank">#{topCustomers.indexOf(customer) + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {popup && <LoadingPopup />}
    </div >
  );
};

export default Customers;