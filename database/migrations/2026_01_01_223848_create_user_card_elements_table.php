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
        Schema::create('user_card_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_card_id')->constrained()->onDelete('cascade');
            $table->string('element', 16); // fire/water/wind/earth/mech
            $table->tinyInteger('current')->default(0); // 0-100
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['user_card_id', 'element']);
            
            // Index on element
            $table->index('element');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_card_elements');
    }
};
