<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    // LISTAR movimientos de un producto
    public function index(Product $product)
    {
        $movements = StockMovement::where('product_id', $product->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('StockMovements/Index', [
            'product'   => $product,
            'movements' => $movements,
        ]);
    }

    // MOSTRAR formulario de nuevo movimiento
    public function create(Product $product)
    {
        return Inertia::render('StockMovements/Create', [
            'product' => $product,
        ]);
    }

    // GUARDAR nuevo movimiento
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type'     => 'required|in:entrada,salida',
            'quantity' => 'required|integer|min:1',
            'note'     => 'nullable|string|max:255',
        ]);

        // Verificar que hay suficiente stock para una salida
        if ($validated['type'] === 'salida' && $product->stock < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'No hay suficiente stock. Stock actual: ' . $product->stock
            ]);
        }

        $stock_before = $product->stock;

        // Calcular nuevo stock
        if ($validated['type'] === 'entrada') {
            $stock_after = $stock_before + $validated['quantity'];
        } else {
            $stock_after = $stock_before - $validated['quantity'];
        }

        // Registrar el movimiento
        StockMovement::create([
            'product_id'   => $product->id,
            'user_id'      => auth()->user()->id,
            'type'         => $validated['type'],
            'quantity'     => $validated['quantity'],
            'stock_before' => $stock_before,
            'stock_after'  => $stock_after,
            'note'         => $validated['note'] ?? null,
        ]);

        // Actualizar el stock del producto
        $product->update(['stock' => $stock_after]);

        return redirect()->route('products.movements.index', $product->id)
            ->with('success', 'Movimiento registrado exitosamente!');
    }
}
