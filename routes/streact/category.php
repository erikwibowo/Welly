<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::resource('category', CategoryController::class)->except('create', 'show', 'edit');
Route::post('category/destroy-bulk', [CategoryController::class, 'destroyBulk'])->name('category.destroy-bulk');
Route::get('category/get-category', [CategoryController::class, 'getCategory'])->name('category.get-category');
