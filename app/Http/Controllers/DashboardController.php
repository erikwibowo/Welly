<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'title' => __('app.text.dashboard'),
            'totals' => [
                'assets' => Asset::where('type', 'asset')->sum('initial_value') - Asset::where('type', 'liability')->sum('initial_value') - Transaction::where('type', 'expense')->sum('amount') + Transaction::where('type', 'income')->sum('amount'),
                'incomes' => Transaction::where('type', 'income')->sum('amount'),
                'expenses' => Transaction::where('type', 'expense')->sum('amount'),
            ]
        ]);
    }
}
