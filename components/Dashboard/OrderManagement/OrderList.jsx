"use client"

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

// Sample order data - replace with your API data
const initialOrders = [
    { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', product: 'Wireless Headphones', amount: 129.99, status: 'delivered', date: '2024-11-25', quantity: 2 },
    { id: 'ORD-002', customer: 'Sarah Smith', email: 'sarah@example.com', product: 'Laptop Stand', amount: 49.99, status: 'pending', date: '2024-11-28', quantity: 1 },
    { id: 'ORD-003', customer: 'Mike Johnson', email: 'mike@example.com', product: 'USB-C Cable', amount: 19.99, status: 'shipped', date: '2024-11-27', quantity: 3 },
    { id: 'ORD-004', customer: 'Emily Brown', email: 'emily@example.com', product: 'Mechanical Keyboard', amount: 159.99, status: 'processing', date: '2024-11-26', quantity: 1 },
    { id: 'ORD-005', customer: 'David Lee', email: 'david@example.com', product: 'Monitor 27"', amount: 299.99, status: 'cancelled', date: '2024-11-24', quantity: 1 },
    { id: 'ORD-006', customer: 'Lisa Wang', email: 'lisa@example.com', product: 'Webcam HD', amount: 89.99, status: 'delivered', date: '2024-11-23', quantity: 1 },
    { id: 'ORD-007', customer: 'Tom Harris', email: 'tom@example.com', product: 'Mouse Pad', amount: 24.99, status: 'shipped', date: '2024-11-28', quantity: 2 },
    { id: 'ORD-008', customer: 'Anna Martinez', email: 'anna@example.com', product: 'Phone Case', amount: 15.99, status: 'pending', date: '2024-11-29', quantity: 1 },
];

const OrderList = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Pending' },
        processing: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Package, label: 'Processing' },
        shipped: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Truck, label: 'Shipped' },
        delivered: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, label: 'Delivered' },
        cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'Cancelled' },
    };

    const filteredAndSortedOrders = useMemo(() => {
        let result = orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.product.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc': return new Date(b.date) - new Date(a.date);
                case 'date-asc': return new Date(a.date) - new Date(b.date);
                case 'amount-desc': return b.amount - a.amount;
                case 'amount-asc': return a.amount - b.amount;
                default: return 0;
            }
        });

        return result;
    }, [orders, searchTerm, statusFilter, sortBy]);

    const stats = useMemo(() => {
        const total = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const pending = orders.filter(o => o.status === 'pending').length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        return { total, totalRevenue, pending, delivered };
    }, [orders]);

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const exportToCSV = () => {
        const headers = ['Order ID', 'Customer', 'Email', 'Product', 'Amount', 'Status', 'Date', 'Quantity'];
        const csvData = filteredAndSortedOrders.map(order =>
            [order.id, order.customer, order.email, order.product, order.amount, order.status, order.date, order.quantity].join(',')
        );
        const csv = [headers.join(','), ...csvData].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders.csv';
        a.click();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 py-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#a34610] mb-2">Order Management</h1>
                    <p className="text-[#a34610]">Track and manage all your orders in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#C8AF9C] rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-[#a34610] mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-[#a34610]">{stats.total}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#C8AF9C] rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-[#a34610] mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-[#a34610]">৳ {stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#C8AF9C] rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-[#a34610] mb-1">Pending</p>
                                <p className="text-3xl font-bold text-[#a34610]">{stats.pending}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#C8AF9C] rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-[#a34610] mb-1">Delivered</p>
                                <p className="text-3xl font-bold text-[#a34610]">{stats.delivered}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <Truck className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#C8AF9C] rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search orders, customers, products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-[#a34610] rounded-xl focus:ring-2 focus:ring-[#a34610] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-[#a34610] rounded-xl focus:ring-2 focus:ring-[#a34610] focus:border-transparent outline-none transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 px-4 py-3 border border-[#a34610] rounded-xl focus:ring-2 focus:ring-[#a34610] focus:border-transparent outline-none transition-all"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Highest Amount</option>
                                <option value="amount-asc">Lowest Amount</option>
                            </select>
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-3 bg-[#a34610] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#C8AF9C] text-[#a34610]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedOrders.map((order, index) => {
                                    const StatusIcon = statusConfig[order.status].icon;
                                    return (
                                        <tr key={order.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-[#a34610]">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-[#a34610]">{order.customer}</div>
                                                    <div className="text-sm text-">{order.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">{order.product}</td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">{order.quantity}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-[#a34610]">৳{order.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">{order.date}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig[order.status].color} outline-none cursor-pointer`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredAndSortedOrders.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Package size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">No orders found</p>
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#a34610]">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#a34610]">Order ID</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Date</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Customer</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Email</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Product</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.product}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Quantity</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Amount</p>
                                        <p className="text-lg font-semibold text-green-600">${selectedOrder.amount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a34610]">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${statusConfig[selectedOrder.status].color}`}>
                                            {statusConfig[selectedOrder.status].label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;