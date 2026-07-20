<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Campos que se pueden guardar masivamente
    protected $fillable = [
        'name',
        'barcode',
        'description',
        'price',
        'stock',
        'unit',
        'category',
        'active',
        'user_id',
    ];

    // Tipos de datos correctos
    protected $casts = [
        'price'  => 'decimal:2',
        'stock'  => 'integer',
        'active' => 'boolean',
    ];

    // Relación — cada producto pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
