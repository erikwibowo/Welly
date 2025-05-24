<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CategoryStoreRequest;
use App\Http\Requests\Category\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:category create', only: ['create', 'store']),
            new Middleware('permission:category read', only: ['index']),
            new Middleware('permission:category update', only: ['update']),
            new Middleware('permission:category delete', only: ['destroy', 'destroyBulk']),
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
        $categories =  Category::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $categories->orderBy($request->field, $request->order);
        }
        return Inertia::render('category/index', [
            'title' => 'Kategori',
            'filters' => $filters,
            'categories' => $categories->paginate($filters['perpage'])->onEachSide(0)->appends('query', null)->withQueryString()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryStoreRequest $request)
    {
        try {
            $category = Category::create([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'type' => $request->type,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $category->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryUpdateRequest $request, Category $category)
    {
        try {
            $category->update([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'type' => $request->type,
            ]);
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $category->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $category->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $category->name])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    public function destroyBulk(Request $request)
    {
        DB::beginTransaction();
        try {
            $categories = Category::whereIn('id', $request->id);
            $categories->delete();
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
