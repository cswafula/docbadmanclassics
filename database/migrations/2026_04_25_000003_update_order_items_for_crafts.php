<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop FK if it still exists (may have been removed in a partial prior run)
        try {
            Schema::table('order_items', fn (Blueprint $t) => $t->dropForeign(['painting_id']));
        } catch (\Throwable) {}

        Schema::table('order_items', function (Blueprint $table) {
            // Make painting_id nullable (no FK re-added — title is denormalized)
            $table->integer('painting_id')->nullable()->change();

            // Add craft reference
            $table->unsignedBigInteger('craft_id')->nullable()->after('painting_id');
            $table->foreign('craft_id')->references('id')->on('crafts')->nullOnDelete();

            // Discriminator so we know which table the item came from
            $table->string('item_type', 20)->default('painting')->after('craft_id');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['craft_id']);
            $table->dropForeign(['painting_id']);
            $table->dropColumn(['craft_id', 'item_type']);
            $table->integer('painting_id')->nullable(false)->change();
            $table->foreign('painting_id')->references('id')->on('paintings');
        });
    }
};
