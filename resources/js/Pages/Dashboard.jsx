import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, low_stock_products }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    📊 Dashboard — Visoft Inventory
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Total Productos */}
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Productos</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">
                            {stats.total_products}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">en inventario</p>
                    </div>

                    {/* Valor del Inventario */}
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Valor Inventario</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                            ${Number(stats.inventory_value).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">valor total</p>
                    </div>

                    {/* Stock Bajo */}
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-500">Stock Bajo</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">
                            {stats.low_stock}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">menos de 10 unidades</p>
                    </div>

                    {/* Sin Stock */}
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                        <p className="text-sm text-gray-500">Sin Stock</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">
                            {stats.out_of_stock}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">productos agotados</p>
                    </div>

                </div>

                {/* Tabla de productos con stock bajo */}
                <div className="bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                        <h3 className="font-semibold text-gray-800">
                            ⚠️ Productos con Stock Bajo
                        </h3>
                        <Link
                            href="/products"
                            className="text-sm text-orange-500 hover:text-orange-600"
                        >
                            Ver todos →
                        </Link>
                    </div>

                    {low_stock_products.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-2xl mb-2">✅</p>
                            <p>Todos los productos tienen stock suficiente</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-500">Producto</th>
                                    <th className="px-6 py-3 text-left text-gray-500">Categoría</th>
                                    <th className="px-6 py-3 text-right text-gray-500">Stock</th>
                                    <th className="px-6 py-3 text-center text-gray-500">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {low_stock_products.map((product) => (
                                    <tr key={product.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium">{product.name}</td>
                                        <td className="px-6 py-3 text-gray-500">{product.category || '—'}</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                product.stock === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Actualizar Stock
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Acceso rápido */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="/products"
                        className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-5 text-center transition"
                    >
                        <p className="text-2xl mb-2">📦</p>
                        <p className="font-semibold">Ver Productos</p>
                    </Link>
                    <Link
                        href="/products/create"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-5 text-center transition"
                    >
                        <p className="text-2xl mb-2">➕</p>
                        <p className="font-semibold">Nuevo Producto</p>
                    </Link>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
