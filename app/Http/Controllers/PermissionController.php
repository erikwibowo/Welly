<?php

namespace App\Http\Controllers;

use App\Http\Requests\Permission\PermissionStoreRequest;
use App\Http\Requests\Permission\PermissionUpdateRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:permission create', only: ['create', 'store']),
            new Middleware('permission:permission read', only: ['index']),
            new Middleware('permission:permission update', only: ['update']),
            new Middleware('permission:permission delete', only: ['destroy', 'destroyBulk']),
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
        $permissions =  Permission::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $permissions->orderBy($request->field, $request->order);
        }
        return Inertia::render('permissions/index', [
            'title' => __('app.text.permission'),
            'filters' => $filters,
            'permissions' => $permissions->paginate($filters['perpage'])->onEachSide(0)->appends('query', null)->withQueryString()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $permission = Permission::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            $superadmin = Role::whereName('superadmin')->first();
            $superadmin->givePermissionTo([$request->name]);
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $permission->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionUpdateRequest $request, Permission $permission)
    {

        DB::beginTransaction();
        try {
            $superadmin = Role::whereName('superadmin')->first();
            $superadmin->revokePermissionTo([$permission->name]);
            $permission->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            $superadmin->givePermissionTo([$permission->name]);
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $permission->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        DB::beginTransaction();
        try {
            $superadmin = Role::whereName('superadmin')->first();
            $superadmin->revokePermissionTo([$permission->name]);
            $permission->delete();
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $permission->name])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    public function destroyBulk(Request $request)
    {
        DB::beginTransaction();
        try {
            $superadmin = Role::whereName('superadmin')->first();
            $permissions = Permission::whereIn('id', $request->id);
            foreach ($permissions->get() as $permission) {
                $superadmin->revokePermissionTo([$permission->name]);
            }
            $permissions->delete();
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            DB::rollback();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
