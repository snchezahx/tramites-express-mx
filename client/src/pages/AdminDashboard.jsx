import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchOrders();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/admin-gestor-seguro');
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setOrders(data || []);
        } catch (err) {
            setError('Error al cargar las órdenes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, currentStatus) => {
        const newStatus = currentStatus === 'Pendiente' ? 'Pagado' : 'Pendiente';

        try {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (updateError) throw updateError;

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            alert('Error al actualizar el estado');
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin-gestor-seguro');
    };

    const filteredOrders = orders.filter(order =>
        order.curp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-guinda to-guinda-dark text-white py-4 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-10 bg-green-600 rounded"></div>
                                <div className="w-1.5 h-10 bg-white rounded"></div>
                                <div className="w-1.5 h-10 bg-red-600 rounded"></div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Panel de Administración</h1>
                                <p className="text-sm text-dorado-light">Gestión de Órdenes</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600 mb-1">Total de Órdenes</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {orders.filter(o => o.status === 'Pendiente').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                        <p className="text-sm text-gray-600 mb-1">Pagadas</p>
                        <p className="text-3xl font-bold text-green-600">
                            {orders.filter(o => o.status === 'Pagado').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-guinda">
                        <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                        <p className="text-3xl font-bold text-guinda">
                            ${orders.reduce((sum, o) => sum + o.service_price, 0)}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                    <div className="flex items-center space-x-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por CURP, Referencia o Tipo de Trámite..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 outline-none text-gray-700"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-guinda to-guinda-dark text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha y Hora</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Tipo de Trámite</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">CURP</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Referencia</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Teléfono</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Comprobante</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {order.service_type}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                {order.curp}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-guinda font-mono font-semibold">
                                                {order.reference_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {order.phone_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                                ${order.service_price}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {order.receipt_url ? (
                                                    <a
                                                        href={order.receipt_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Ver
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No subido</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={order.status === 'Pagado' ? 'badge-paid' : 'badge-pending'}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleStatusChange(order.id, order.status)}
                                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${order.status === 'Pendiente'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        }`}
                                                >
                                                    {order.status === 'Pendiente' ? '✓ Marcar Pagado' : '⟲ Marcar Pendiente'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
