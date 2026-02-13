<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paintings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('artist');
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->string('size')->nullable();
            $table->string('medium')->nullable();
            $table->year('year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('painting_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('painting_id')->constrained()->onDelete('cascade');
            $table->string('image_path');
            $table->integer('order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('painting_images');
        Schema::dropIfExists('paintings');
    }
};