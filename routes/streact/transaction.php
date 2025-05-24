<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::resource('transaction', TransactionController::class)->except('create', 'show', 'edit');
Route::post('transaction/destroy-bulk', [TransactionController::class, 'destroyBulk'])->name('transaction.destroy-bulk');