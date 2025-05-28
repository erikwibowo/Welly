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
    public function index(Request $request): Response
    {
        $filters = [
            'dateFrom' => $request->dateFrom ?? now()->startOfMonth()->format('Y-m-d'),
            'dateTo' => $request->dateTo ?? now()->endOfMonth()->format('Y-m-d'),
        ];
        return Inertia::render('dashboard', [
            'title' => __('app.text.dashboard'),
            'totals' => [
                'assets' => Asset::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'asset')->sum('initial_value') - Asset::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'liability')->sum('initial_value') - Transaction::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'expense')->sum('amount') + Transaction::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'income')->sum('amount'),
                'incomes' => Transaction::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'income')->sum('amount'),
                'expenses' => Transaction::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->where('type', 'expense')->sum('amount'),
            ],
            'transactions' => Transaction::whereHas('user', function ($query) {
                $query->where('parent_id', auth()->user()->parent_id);
            })->whereBetween('date', [$filters['dateFrom'], $filters['dateTo']])
                ->orderBy('date', 'desc')
                ->with(['from', 'to', 'user', 'category'])->latest()->get(),
            'froms' => Asset::whereHas('user', function ($query) {
                $query->where('parent_id', auth()->user()->parent_id);
            })->orderBy('name')->get(),
            'tos' => Asset::whereHas('user', function ($query) {
                $query->where('parent_id', auth()->user()->parent_id);
            })->orderBy('name')->get(),
        ]);
    }
}
