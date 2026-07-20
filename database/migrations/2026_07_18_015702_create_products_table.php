<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');                        // nombre del producto
            $table->string('barcode')->unique()->nullable(); // código de barra
            $table->text('description')->nullable();        // descripción
            $table->decimal('price', 10, 2)->default(0);   // precio
            $table->integer('stock')->default(0);           // cantidad en inventario
            $table->string('unit')->default('unit');        // unidad (kg, litro, unidad)
            $table->string('category')->nullable();         // categoría
            $table->boolean('active')->default(true);       // producto activo o no
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // dueño
            $table->timestamps();                           // created_at y updated_at
       });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
