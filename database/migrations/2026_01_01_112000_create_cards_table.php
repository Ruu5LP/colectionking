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
        Schema::create('cards', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->enum('kind', ['NORMAL', 'SPECIAL']);
            $table->enum('hand', ['ROCK', 'SCISSORS', 'PAPER']);
            $table->integer('atk');
            $table->integer('def');
            $table->enum('element', ['FIRE', 'WIND', 'WATER'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
