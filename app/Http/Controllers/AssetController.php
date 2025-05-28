<?php

namespace App\Http\Controllers;

use App\Http\Requests\Asset\AssetStoreRequest;
use App\Http\Requests\Asset\AssetUpdateRequest;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:asset create', only: ['create', 'store']),
            new Middleware('permission:asset read', only: ['index']),
            new Middleware('permission:asset update', only: ['update']),
            new Middleware('permission:asset delete', only: ['destroy', 'destroyBulk']),
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
        ];
        $assets =  Asset::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $assets->orderBy($request->field, $request->order);
        }
        return Inertia::render('asset/index', [
            'title' => 'Aset & Liabilitas',
            'filters' => $filters,
            'totals' => [
                'initial_value' => Asset::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->sum('initial_value'),
                'balance' => Asset::whereHas('user', function ($query) {
                    $query->where('parent_id', auth()->user()->parent_id);
                })->with(['transactionsFrom', 'transactionsTo'])->get()->sum(function ($asset) {
                    return $asset->transactionsFrom->sum('amount') - $asset->transactionsTo->sum('amount');
                }),
            ],
            'assets' => $assets->query(function ($query) {
                if (!auth()->user()->hasRole('superadmin')) {
                    $query->whereHas('user', function ($query) {
                        $query->where('parent_id', auth()->user()->parent_id);
                    });
                }
                $query->with(['transactionsFrom.from', 'transactionsFrom.to', 'transactionsTo.from', 'transactionsTo.to']);
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
    public function store(AssetStoreRequest $request)
    {
        try {
            $asset = Asset::create([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'owner' => $request->owner,
                'initial_value' => $request->initial_value,
                'type' => $request->type,
                'note' => $request->note,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $asset->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Asset $asset)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Asset $asset)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AssetUpdateRequest $request, Asset $asset)
    {
        try {
            $asset->update([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'owner' => $request->owner,
                'initial_value' => $request->initial_value,
                'type' => $request->type,
                'note' => $request->note,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $asset->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asset $asset)
    {
        try {
            $asset->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $asset->name])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    public function destroyBulk(Request $request)
    {
        DB::beginTransaction();
        try {
            $assets = Asset::whereIn('id', $request->id);
            $assets->delete();
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
