<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\RoleStoreRequest;
use App\Http\Requests\Role\RoleUpdateRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:role create', only: ['create', 'store']),
            new Middleware('permission:role read', only: ['index']),
            new Middleware('permission:role update', only: ['update']),
            new Middleware('permission:role delete', only: ['destroy', 'destroyBulk']),
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
        $roles =  Role::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $roles->orderBy($request->field, $request->order);
        }
        return Inertia::render('roles/index', [
            'title' => __('app.text.role'),
            'filters' => $filters,
            'permissions' => Permission::getDataByGroupSuperadmin(),
            'roles' => $roles->query(function ($query) {
                $query->with('permissions');
            })->paginate($filters['perpage'])->onEachSide(0)->appends('query', null)->withQueryString()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $role = Role::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            $role->givePermissionTo($request->permissions);
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $role->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        DB::beginTransaction();
        try {
            $role->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            $role->syncPermissions($request->permissions);
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $role->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        try {
            $role->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $role->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }


    public function destroyBulk(Request $request)
    {
        try {
            $roles = Role::whereIn('id', $request->id);
            $roles->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
