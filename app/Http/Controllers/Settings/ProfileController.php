<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('profiles/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $user = $request->user();

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
            $user->fill([
                'name' => $request->name,
                'email' => $request->email,
                'image' => $filename,
            ]);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => __('app.text.profile_information')])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function collaborator(): Response
    {
        return Inertia::render('profiles/collaborator', [
            'title' => 'Anggota',
            'users' => User::where('parent_id', Auth::user()->id)->get(),
        ]);
    }
}
