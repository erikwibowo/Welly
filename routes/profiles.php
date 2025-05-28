<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('profiles', 'profiles/profile');

    Route::get('profiles/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profiles/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profiles/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('profiles/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('profiles/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('profiles/delete', function () {
        return Inertia::render('profiles/delete');
    })->name('delete');


    Route::get('profiles/collaborator', [ProfileController::class, 'collaborator'])->name('profile.collaborator');
});
