<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    $products = \App\Models\Product::where('user_id', $user->id)->get();

    $stats = [
        'total_products'  => $products->count(),
        'low_stock'       => $products->where('stock', '<', 10)->where('stock', '>', 0)->count(),
        'out_of_stock'    => $products->where('stock', 0)->count(),
        'inventory_value' => $products->sum(fn($p) => $p->price * $p->stock),
    ];

    $low_stock_products = \App\Models\Product::where('user_id', $user->id)
        ->where('stock', '<', 10)
        ->orderBy('stock', 'asc')
        ->get();

    return Inertia::render('Dashboard', [
        'stats'             => $stats,
        'low_stock_products' => $low_stock_products,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas de Productos — protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductController::class);

    // Rutas de movimientos de stock
    Route::get('products/{product}/movements', [StockMovementController::class, 'index'])
        ->name('products.movements.index');
    Route::get('products/{product}/movements/create', [StockMovementController::class, 'create'])
        ->name('products.movements.create');
    Route::post('products/{product}/movements', [StockMovementController::class, 'store'])
        ->name('products.movements.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
