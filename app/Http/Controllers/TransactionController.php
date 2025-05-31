<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transaction\TransactionStoreRequest;
use App\Http\Requests\Transaction\TransactionUpdateRequest;
use App\Models\Asset;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:transaction create', only: ['create', 'store']),
            new Middleware('permission:transaction read', only: ['index']),
            new Middleware('permission:transaction update', only: ['update']),
            new Middleware('permission:transaction delete', only: ['destroy', 'destroyBulk']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'page' => $request->page ?? 1,
            'perpage' => $request->perpage ?? 15,
            'q' => $request->q ?? '',
            'field' => $request->field ?? '',
            'order' => $request->order ?? '',
            'dateFrom' => $request->dateFrom ?? now()->startOfMonth()->format('Y-m-d'),
            'dateTo' => $request->dateTo ?? now()->lastOfMonth()->format('Y-m-d'),
        ];
        $transactions =  Transaction::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $transactions->orderBy($request->field, $request->order);
        }
        return Inertia::render('transaction/index', [
            'title' => 'Transaksi',
            'filters' => $filters,
            'froms' => Asset::whereHas('user', function ($query) {
                $query->where('parent_id', auth()->user()->parent_id);
            })->orderBy('name')->get(),
            'tos' => Asset::whereHas('user', function ($query) {
                $query->where('parent_id', auth()->user()->parent_id);
            })->orderBy('name')->get(),
            'transactions' => $transactions->query(function ($query) use ($filters) {
                $query->with(['category', 'from', 'to', 'user']);
                $query->whereBetween('date', [$filters['dateFrom'], $filters['dateTo']]);
                if (!auth()->user()->hasRole('superadmin')) {
                    $query->whereHas('user', function ($query) {
                        $query->where('parent_id', auth()->user()->parent_id);
                    });
                }
            })->paginate($filters['perpage'])->onEachSide(0)->appends('query', null)->withQueryString()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(TransactionStoreRequest $request)
    {
        try {
            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'category_id' => $request->category_id,
                'from_asset_id' => $request->from_asset_id,
                'to_asset_id' => $request->type != 'transfer' ? null : $request->to_asset_id,
                'type' => $request->type,
                'date' => date('Y-m-d', strtotime($request->date)),
                'amount' => $request->amount,
                'note' => $request->note,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $transaction->type_view])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TransactionUpdateRequest $request, Transaction $transaction)
    {
        try {
            $transaction->update([
                'category_id' => $request->category_id,
                'from_asset_id' => $request->from_asset_id,
                'to_asset_id' => $request->type != 'transfer' ? null : $request->to_asset_id,
                'type' => $request->type,
                'date' => date('Y-m-d', strtotime($request->date)),
                'amount' => $request->amount,
                'note' => $request->note,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $transaction->type_view])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        try {
            $transaction->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $transaction->type_view])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    public function destroyBulk(Request $request)
    {
        DB::beginTransaction();
        try {
            $transactions = Transaction::whereIn('id', $request->id);
            $transactions->delete();
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
