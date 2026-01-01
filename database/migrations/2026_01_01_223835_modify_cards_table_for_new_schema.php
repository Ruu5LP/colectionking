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
        Schema::table('cards', function (Blueprint $table) {
            // Remove columns that are no longer needed (with conditional checks)
            if (Schema::hasColumn('cards', 'kind')) {
                $table->dropColumn('kind');
            }
            if (Schema::hasColumn('cards', 'element')) {
                $table->dropColumn('element');
            }
            
            // Add new columns
            $table->tinyInteger('rarity')->after('def');
            $table->text('description')->nullable()->after('rarity');
            $table->string('image_url')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Restore removed columns
            $table->enum('kind', ['NORMAL', 'SPECIAL'])->after('name');
            $table->enum('element', ['FIRE', 'WIND', 'WATER'])->nullable()->after('def');
            
            // Remove added columns
            $table->dropColumn(['rarity', 'description', 'image_url']);
        });
    }
};
