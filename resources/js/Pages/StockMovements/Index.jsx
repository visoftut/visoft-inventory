import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, product, movements }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📈 Movimientos — {product.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={`/products/${product.id}/movements/create`}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                            + Nuevo Movimiento
                        </Link>
                        <Link
                            href="/products"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            ← Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Movimientos - ${product.name}`} />

            <div className="py-6 px-4 max-w-7xl mx-auto space-y-4">

                {/* Info del producto */}
                <div className="bg-white rounded-lg shadow p-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Stock Actual</p>
                        <p className="text-3xl font-bold text-blue-600">{product.stock}</p>
                        <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="text-3xl font-bold text-green-600">${product.price}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Total Movimientos</p>
                        <p className="text-3xl font-bold text-gray-600">{movements.length}</p>
                    </div>
                </div>

                {/* Lista de movimientos */}
                {movements.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow">
                        <p className="text-4xl mb-4">📋</p>
                        <p className="text-xl">No hay movimientos registrados</p>
                        <Link
                            href={`/products/${product.id}/movements/create`}
                            className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg"
                        >
                            Registrar primer movimiento
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Fecha</th>
                                    <th className="px-4 py-3 text-center">Tipo</th>
                                    <th className="px-4 py-3 text-right">Cantidad</th>
                                    <th className="px-4 py-3 text-right">Stock Antes</th>
                                    <th className="px-4 py-3 text-right">Stock Después</th>
                                    <th className="px-4 py-3 text-left">Nota</th>
                                    <th className="px-4 py-3 text-left">Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((movement) => (
                                    <tr key={movement.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(movement.created_at).toLocaleDateString('es-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                movement.type === 'entrada'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {movement.type === 'entrada' ? '⬆️ Entrada' : '⬇️ Salida'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold">
                                            {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-500">{movement.stock_before}</td>
                                        <td className="px-4 py-3 text-right font-medium">{movement.stock_after}</td>
                                        <td className="px-4 py-3 text-gray-500">{movement.note || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500">{movement.user?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
