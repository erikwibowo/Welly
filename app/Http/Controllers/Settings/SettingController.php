<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SettingUpdateRequest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('permission:setting read', only: ['index', 'seo', 'image', 'contact']),
            new Middleware('permission:setting update', only: ['update']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('settings/general', [
            'title' => __('app.text.setting'),
            'setting' => Setting::first(),
        ]);
    }
    public function seo(Request $request)
    {
        return Inertia::render('settings/seo', [
            'title' => __('app.text.setting'),
            'setting' => Setting::first(),
        ]);
    }
    public function image(Request $request)
    {
        return Inertia::render('settings/image', [
            'title' => __('app.text.setting'),
            'setting' => Setting::first(),
        ]);
    }
    public function contact(Request $request)
    {
        return Inertia::render('settings/contact', [
            'title' => __('app.text.setting'),
            'setting' => Setting::first(),
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SettingUpdateRequest $request, Setting $setting)
    {
        try {
            $request->validate([
                'source' => ['required', 'string'],
            ]);
            if ($request->source == 'general') {
                $setting->update([
                    'app_name' => $request->app_name,
                    'app_short_name' => $request->app_short_name,
                    'app_version' => $request->app_version,
                    'app_tagline' => $request->app_tagline,
                    'app_description' => $request->app_description,
                ]);
            }
            if ($request->source == 'seo') {
                if ($request->meta_banner != null) {
                    $filename =  "meta_banner" . time() . "." . $request->meta_banner->extension();
                    Storage::put('image/setting/' . $filename, File::get($request->meta_banner));
                } else {
                    if ($setting->meta_banner != null) {
                        Storage::disk('public')->delete('image/setting/' . $setting->meta_banner);
                        $filename = null;
                    } else {
                        $filename = $setting->meta_banner;
                    }
                }
                $setting->update([
                    'seo_enabled' => $request->seo_enabled,
                    'meta_title' => $request->meta_title,
                    'meta_description' => $request->meta_description,
                    'meta_banner' => $filename,
                    'meta_keywords' => $request->meta_keywords,
                    'meta_author' => $request->meta_author,
                ]);
            }
            if ($request->source == 'image') {
                $images = ['app_favicon', 'app_logo', 'app_logo_dark'];
                $updatedImages = [];

                foreach ($images as $image) {
                    if ($request->$image != null) {
                        Storage::disk('public')->delete('image/setting/' . $setting->$image);
                        $filename = $image . "_" . time() . "." . $request->$image->extension();
                        Storage::put('image/setting/' . $filename, File::get($request->$image));
                        $updatedImages[$image] = $filename;
                    } else {
                        if ($setting->$image != null) {
                            Storage::disk('public')->delete('image/setting/' . $setting->$image);
                            $updatedImages[$image] = null;
                        } else {
                            $updatedImages[$image] = $setting->$image;
                        }
                    }
                }

                $setting->update($updatedImages);
            }
            if ($request->source == 'contact') {
                $setting->update([
                    'app_email' => $request->app_email,
                    'app_phone' => $request->app_phone,
                    'app_whatsapp' => $request->app_whatsapp,
                    'app_facebook' => $request->app_facebook,
                    'app_instagram' => $request->app_instagram,
                    'app_twitter' => $request->app_twitter,
                    'app_tiktok' => $request->app_tiktok,
                    'app_address' => $request->app_address,
                ]);
            }
            return back()->with(['type' => 'success', 'message' => __('app.banner.updated', ['name' => __('app.text.setting')])]);
        } catch (\Throwable $th) {
            return back()->with(['type' => 'destructive', 'message' => __('app.banner.error', ['error' => $th->getMessage()])]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
