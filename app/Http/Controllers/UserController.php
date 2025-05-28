<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:user create', only: ['create', 'store']),
            new Middleware('permission:user read', only: ['index']),
            new Middleware('permission:user update', only: ['update']),
            new Middleware('permission:user delete', only: ['destroy', 'destroyBulk']),
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
        $users =  User::search($filters['q']);
        if ($request->has(['field', 'order'])) {
            $users->orderBy($request->field, $request->order);
        }
        $roles = Role::orderBy('name');
        if (!auth()->user()->hasRole('superadmin')) {
            $roles = Role::where('name', '<>', 'superadmin');
        }
        return Inertia::render('users/index', [
            'title' => __('app.text.user'),
            'filters' => $filters,
            'roles' => $roles->get(),
            'users' => $users->query(function ($query) {
                $query->with('roles', 'roles.permissions');
                if (!auth()->user()->hasRole('superadmin')) {
                    $query->withoutRole('superadmin');
                }
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
    public function store(UserStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            if ($request->image != null) {
                $filename =  "user_" . time() . "." . $request->image->extension();
                Storage::put('image/user/' . $filename, File::get($request->image));
            } else {
                $filename = null;
            }
            $user = User::forceCreate([
                'image' => $filename,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(),
            ]);
            if ($request->source == 'user') {
                $user->assignRole($request->roles);
                $user->update([
                    'parent_id' => $user->id,
                ]);
            } else {
                $user->assignRole('admin');
                $user->update([
                    'parent_id' => auth()->id(),
                ]);
            }
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.created', ['name' => $user->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        if ($request->image != null) {
            Storage::disk('public')->delete('image/user/' . $user->image);
            $filename =  "user_" . time() . "." . $request->image->extension();
            Storage::put('image/user/' . $filename, File::get($request->image));
        } else {
            if ($request->remove_image) {
                Storage::disk('public')->delete('image/user/' . $user->image);
                $filename = null;
            } else {
                $filename = $user->image;
            }
        }
        DB::beginTransaction();
        try {
            $user->update([
                'image'     => $filename,
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password ? Hash::make($request->password) : $user->password,
            ]);
            $user->syncRoles($request->roles);
            DB::commit();
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => $user->name])]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            Storage::disk('public')->delete('image/user/' . $user->image);
            $user->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => $user->name])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    public function destroyBulk(Request $request)
    {
        try {
            $users = User::whereIn('id', $request->id);
            foreach ($users->get() as $user) {
                Storage::disk('public')->delete('image/user/' . $user->image);
            }
            $users->delete();
            return back()->with(['type' => 'success', 'message' => __('app.banner.deleted', ['name' => count($request->id) . ' data'])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }
}
