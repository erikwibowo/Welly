<?php

use App\Http\Controllers\Settings\SettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/general');


    Route::get('settings/general', [SettingController::class, 'index'])->name('setting.index');
    Route::get('settings/seo', [SettingController::class, 'seo'])->name('setting.seo');
    Route::get('settings/image', [SettingController::class, 'image'])->name('setting.image');
    Route::get('settings/contact', [SettingController::class, 'contact'])->name('setting.contact');
    Route::patch('settings/update/{setting}', [SettingController::class, 'update'])->name('setting.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
