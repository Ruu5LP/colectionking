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
        Schema::create('user_collection_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_collection_id')->constrained()->onDelete('cascade');
            $table->string('element', 16); // fire/water/wind/earth/mech
            $table->tinyInteger('current')->default(0); // 0-100
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['user_collection_id', 'element']);
            
            // Index on element
            $table->index('element');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_collection_elements');
    }
};
