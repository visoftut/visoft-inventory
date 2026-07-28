import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, products, search }) {
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        router.get('/products',
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            router.delete(`/products/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📦 Mis Productos
                    </h2>
                    <Link
                        href="/products/create"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Nuevo Producto
                    </Link>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="py-6 px-4 max-w-7xl mx-auto space-y-4">

                {/* Barra de búsqueda */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Buscar por nombre, código de barra o categoría..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get('/products', {}, { preserveState: true, replace: true });
                                }}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <p className="text-xs text-gray-500 mt-2">
                            {products.length} resultado(s) para "{searchTerm}"
                        </p>
                    )}
                </div>

                {/* Si no hay productos */}
                {products.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow">
                        <p className="text-4xl mb-4">
                            {searchTerm ? '🔍' : '📦'}
                        </p>
                        <p className="text-xl">
                            {searchTerm
                                ? `No se encontraron productos para "${searchTerm}"`
                                : 'No tienes productos aún'
                            }
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/products/create"
                                className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg"
                            >
                                Crear primer producto
                            </Link>
                        )}
                    </div>
                )}

                {/* Tabla de productos */}
                {products.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nombre</th>
                                    <th className="px-4 py-3 text-left">Código</th>
                                    <th className="px-4 py-3 text-left">Categoría</th>
                                    <th className="px-4 py-3 text-right">Precio</th>
                                    <th className="px-4 py-3 text-right">Stock</th>
                                    <th className="px-4 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{product.name}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.barcode || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500">{product.category || '—'}</td>
                                        <td className="px-4 py-3 text-right">${product.price}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                product.stock > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </td>
                                      <td className="px-4 py-3 text-center space-x-2">
                                         <Link
                                             href={`/products/${product.id}/movements`}
                                             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                         >
                                             📈 Stock
                                         </Link>
                                         <Link
                                             href={`/products/${product.id}/edit`}
                                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                         >
                                           Editar
                                         </Link>
                                         <button
                                             onClick={() => handleDelete(product.id)}
                                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                         >
                                           Eliminar
                                         </button>
                                      </td>
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
