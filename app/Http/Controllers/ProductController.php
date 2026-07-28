<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{

    // LISTAR todos los productos
public function index(Request $request)
{
    $user = auth()->user();

    $query = Product::where('user_id', $user->id);

    // Búsqueda por nombre o código de barra
    if ($request->search) {
        $query->where(function($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('barcode', 'like', '%' . $request->search . '%')
              ->orWhere('category', 'like', '%' . $request->search . '%');
        });
    }

    $products = $query->orderBy('created_at', 'desc')->get();

    return Inertia::render('Products/Index', [
        'products' => $products,
        'search'   => $request->search ?? '',
    ]);
}

    // MOSTRAR formulario de creación
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    // GUARDAR producto nuevo
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'barcode'     => 'nullable|string|unique:products',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string',
            'category'    => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->user()->id;

        Product::create($validated);

        return redirect()->route('products.index')
                        ->with('success', 'Producto creado exitosamente!');
    }

    // MOSTRAR formulario de edición
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product
        ]);
    }

    // ACTUALIZAR producto
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'barcode'     => 'nullable|string|unique:products,barcode,' . $product->id,
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string',
            'category'    => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
                        ->with('success', 'Producto actualizado exitosamente!');
    }

    // ELIMINAR producto
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
                        ->with('success', 'Producto eliminado exitosamente!');
    }
}
