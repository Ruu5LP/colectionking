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
        Schema::create('card_elements', function (Blueprint $table) {
            $table->id();
            $table->string('card_id');
            $table->string('element', 16); // fire/water/wind/earth/mech
            $table->tinyInteger('base')->default(0); // 0-100
            $table->tinyInteger('cap')->default(0);  // 0-100
            $table->timestamps();
            
            // Foreign key
            $table->foreign('card_id')->references('id')->on('cards')->onDelete('cascade');
            
            // Unique constraint
            $table->unique(['card_id', 'element']);
            
            // Index on element
            $table->index('element');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_elements');
    }
};
