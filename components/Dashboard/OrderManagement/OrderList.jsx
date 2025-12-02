"use client"

import { CheckCircle, Clock, Download, Eye, FileSpreadsheet, Package, RefreshCw, Search, Truck, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Pending' },
        confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle, label: 'Confirmed' },
        processing: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Package, label: 'Processing' },
        shipped: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Truck, label: 'Shipped' },
        delivered: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, label: 'Delivered' },
        cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'Cancelled' },
    };

    const paymentStatusConfig = {
        unpaid: { color: 'bg-red-100 text-red-800', label: 'Unpaid' },
        paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
        refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/advertise-orders?sort=newest`);
            const data = await response.json();

            if (response.ok) {
                setOrders(data.data || []);
            } else {
                setError(data.message || 'Failed to fetch orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Network error. Please check if the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedOrders = useMemo(() => {
        let result = orders.filter(order => {
            const matchesSearch =
                (order._id || order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm) ||
                order.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'date-asc': return new Date(a.createdAt) - new Date(b.createdAt);
                case 'amount-desc': return b.totalPrice - a.totalPrice;
                case 'amount-asc': return a.totalPrice - b.totalPrice;
                default: return 0;
            }
        });

        return result;
    }, [orders, searchTerm, statusFilter, sortBy]);

    const stats = useMemo(() => {
        const total = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const pending = orders.filter(o => o.status === 'pending').length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        return { total, totalRevenue, pending, delivered };
    }, [orders]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/advertise-orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (response.ok) {
                setOrders(orders.map(order =>
                    (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                alert(data.message || 'Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating order:', err);
            alert('Failed to update order status');
        }
    };

    const exportToCSV = () => {
        const headers = ['Order ID', 'Customer', 'Phone', 'Address', 'Product', 'Quantity', 'Unit Price', 'Total Price', 'Savings', 'Status', 'Payment Status', 'Payment Method', 'Date'];
        const csvData = filteredAndSortedOrders.map(order =>
            [
                `"${order._id || order.id}"`,
                `"${order.name}"`,
                `"${order.phone}"`,
                `"${order.address}"`,
                `"${order.contentTitle}"`,
                order.quantity,
                order.price.toFixed(2),
                order.totalPrice.toFixed(2),
                order.savings.toFixed(2),
                order.status,
                order.paymentStatus,
                order.paymentMethod === 'cash_on_delivery' ? 'COD' : order.paymentMethod,
                `"${new Date(order.createdAt).toLocaleString()}"`
            ].join(',')
        );
        const csv = [headers.join(','), ...csvData].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const exportToExcel = () => {
        // Create worksheet data
        const headers = ['Order ID', 'Customer', 'Phone', 'Address', 'Product', 'Quantity', 'Unit Price', 'Total Price', 'Savings', 'Status', 'Payment Status', 'Payment Method', 'Date'];
        const data = filteredAndSortedOrders.map(order => [
            order._id || order.id,
            order.name,
            order.phone,
            order.address,
            order.contentTitle,
            order.quantity,
            order.price,
            order.totalPrice,
            order.savings,
            order.status,
            order.paymentStatus,
            order.paymentMethod === 'cash_on_delivery' ? 'COD' : order.paymentMethod,
            new Date(order.createdAt).toLocaleString()
        ]);

        // Create HTML table
        let html = '<html><head><meta charset="utf-8"><style>table{border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#a34610;color:white;}</style></head><body>';
        html += '<table>';
        html += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
        html += '<tbody>';
        data.forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
        html += '</tbody></table></body></html>';

        // Create blob and download
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.xls`;
        a.click();
        window.URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 py-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-[#a34610] mb-2">Order Management</h1>
                        <p className="text-[#a34610]">Track and manage all your orders in one place</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-4 py-2 bg-[#a34610] text-white rounded-xl hover:bg-[#8a3c0e] transition-colors shadow-md"
                    >
                        <RefreshCw size={20} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

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
                                    placeholder="Search by name, phone, product..."
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
                                <option value="confirmed">Confirmed</option>
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
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="px-4 py-3 bg-[#a34610] text-white rounded-xl hover:bg-[#8a3c0e] transition-colors shadow-md flex items-center gap-2"
                                    title="Export Data"
                                >
                                    <Download size={20} />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                                {showExportMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                                        <button
                                            onClick={exportToCSV}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-t-xl transition-colors"
                                        >
                                            <FileSpreadsheet size={18} className="text-green-600" />
                                            <span className="text-sm font-medium text-gray-700">Export as CSV</span>
                                        </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-b-xl transition-colors border-t"
                                        >
                                            <FileSpreadsheet size={18} className="text-blue-600" />
                                            <span className="text-sm font-medium text-gray-700">Export as Excel</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Close dropdown when clicking outside */}
                {showExportMenu && (
                    <div
                        className="fixed inset-0 z-0"
                        onClick={() => setShowExportMenu(false)}
                    />
                )}

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#C8AF9C] text-[#a34610]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Qty</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment Method</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedOrders.map((order) => {
                                    const orderId = order._id || order.id;
                                    return (
                                        <tr key={orderId} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-[#a34610]">
                                                {orderId.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-[#a34610]">{order.name}</div>
                                                    <div className="text-sm text-gray-600">{order.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">{order.contentTitle}</td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">{order.quantity}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-[#a34610]">৳{order.totalPrice.toFixed(2)}</div>
                                                {order.savings > 0 && (
                                                    <div className="text-xs text-green-600">Saved: ৳{order.savings.toFixed(2)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#a34610]">
                                                <div className="flex flex-col leading-tight">
                                                    

                                                    <span>
                                                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                    <span>
                                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </td>


                                            <td className="px-6 py-4">

                                                <div className="text-lg font-semibold text-[#a34610] capitalize">
                                                    {order.paymentMethod === 'cash_on_delivery' ? 'COD' : order.paymentMethod.replace('_', ' ')}
                                                </div>

                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig[order.status].color} outline-none cursor-pointer`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${paymentStatusConfig[order.paymentStatus].color}`}>
                                                    {paymentStatusConfig[order.paymentStatus].label}
                                                </span>
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
                            <p className="text-sm mt-2">Orders will appear here when customers place them</p>
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#a34610]">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{(selectedOrder._id || selectedOrder.id).slice(-12)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{formatDate(selectedOrder.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Product</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.contentTitle}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Quantity</p>
                                        <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Unit Price</p>
                                        <p className="text-lg font-semibold text-[#a34610]">৳{selectedOrder.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-lg font-semibold text-green-600">৳{selectedOrder.totalPrice.toFixed(2)}</p>
                                    </div>
                                    {selectedOrder.savings > 0 && (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-600">Original Price</p>
                                                <p className="text-lg font-semibold text-gray-500 line-through">৳{selectedOrder.originalPrice.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Savings</p>
                                                <p className="text-lg font-semibold text-green-600">৳{selectedOrder.savings.toFixed(2)}</p>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${statusConfig[selectedOrder.status].color}`}>
                                            {statusConfig[selectedOrder.status].label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${paymentStatusConfig[selectedOrder.paymentStatus].color}`}>
                                            {paymentStatusConfig[selectedOrder.paymentStatus].label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="text-lg font-semibold text-[#a34610] capitalize">
                                            {selectedOrder.paymentMethod === 'cash_on_delivery' ? 'COD' : selectedOrder.paymentMethod.replace('_', ' ')}
                                        </p>
                                    </div>
                                    {selectedOrder.notes && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600">Notes</p>
                                            <p className="text-lg font-semibold text-[#a34610]">{selectedOrder.notes}</p>
                                        </div>
                                    )}
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