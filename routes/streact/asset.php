<?php

use App\Http\Controllers\AssetController;
use Illuminate\Support\Facades\Route;

Route::resource('asset', AssetController::class)->except('create', 'show', 'edit');
Route::post('asset/destroy-bulk', [AssetController::class, 'destroyBulk'])->name('asset.destroy-bulk');