<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{

    // LISTAR todos los productos
    public function index()
    {
        $user = auth()->user();
        $products = Product::where('user_id', $user->id)
                          ->orderBy('created_at', 'desc')
                          ->get();

        return Inertia::render('Products/Index', [
            'products' => $products
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
