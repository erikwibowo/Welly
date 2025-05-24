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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('restrict');
            $table->bigInteger('from_asset_id')->unsigned();
            $table->bigInteger('to_asset_id')->unsigned()->nullable();
            $table->enum('type', ['income', 'expense', 'transfer'])->default('income');
            $table->date('date');
            $table->double('amount')->default(0);
            $table->text('note')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
