<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getUserPermissions() : [],
            ],
            'message' => [
                'type' => fn() => session('type'),
                'message' => fn() => session('message'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'app' => [
                'languages' => function () {
                    $lang = __('app');
                    return response()->json($lang);
                },
                'locale' => function () {
                    if (session()->has('locale')) {
                        app()->setLocale(session('locale'));
                    }
                    return app()->getLocale();
                },
                'settings' => Setting::first(),
                'perPages' => [
                    ['label' => 5, 'value' => 5],
                    ['label' => 10, 'value' => 10],
                    ['label' => 15, 'value' => 15],
                    ['label' => 20, 'value' => 20],
                    ['label' => 30, 'value' => 30],
                    ['label' => 50, 'value' => 50],
                    ['label' => 100, 'value' => 100],
                ]
            ]
        ];
    }
}
