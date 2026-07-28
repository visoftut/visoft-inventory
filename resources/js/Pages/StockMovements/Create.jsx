import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, product }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'entrada',
        quantity: '',
        note: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/products/${product.id}/movements`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        ➕ Nuevo Movimiento — {product.name}
                    </h2>
                    <Link
                        href={`/products/${product.id}/movements`}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        ← Volver
                    </Link>
                </div>
            }
        >
            <Head title="Nuevo Movimiento" />

            <div className="py-6 px-4 max-w-xl mx-auto">

                {/* Info del producto */}
                <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Producto</p>
                        <p className="font-bold text-gray-800">{product.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Stock Actual</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {product.stock} {product.unit}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Tipo de movimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Movimiento *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'entrada')}
                                    className={`py-3 rounded-lg font-semibold border-2 transition ${
                                        data.type === 'entrada'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-500 hover:border-green-300'
                                    }`}
                                >
                                    ⬆️ Entrada
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'salida')}
                                    className={`py-3 rounded-lg font-semibold border-2 transition ${
                                        data.type === 'salida'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-500 hover:border-red-300'
                                    }`}
                                >
                                    ⬇️ Salida
                                </button>
                            </div>
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad *
                            </label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ej: 50"
                                min="1"
                            />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>

                        {/* Nota */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nota
                            </label>
                            <input
                                type="text"
                                value={data.note}
                                onChange={e => setData('note', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ej: Compra a proveedor, Venta a cliente..."
                            />
                            {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
                        </div>

                        {/* Preview del resultado */}
                        {data.quantity && (
                            <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                <p className="text-gray-500">Resultado:</p>
                                <p className="font-bold text-gray-800">
                                    Stock actual: {product.stock} →{' '}
                                    <span className={data.type === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                                        {data.type === 'entrada'
                                            ? product.stock + parseInt(data.quantity || 0)
                                            : product.stock - parseInt(data.quantity || 0)
                                        } {product.unit}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Botón Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition"
                            >
                                {processing ? 'Guardando...' : '💾 Registrar Movimiento'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
