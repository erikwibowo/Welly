<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{

    protected $fillable = [
        "app_name",
        "app_short_name",
        "app_version",
        "app_tagline",
        "app_description",
        "seo_enabled",
        "meta_title",
        "meta_description",
        "meta_banner",
        "meta_keywords",
        "meta_author",
        "app_logo",
        "app_favicon",
        "app_email",
        "app_phone",
        "app_whatsapp",
        "app_facebook",
        "app_instagram",
        "app_twitter",
        "app_tiktok",
        "app_address",
    ];

    protected $appends = ['full_path_banner', 'full_path_logo', 'full_path_logo_dark', 'full_path_favicon'];

    public function getFullPathBannerAttribute()
    {
        return $this->attributes['meta_banner'] == null ? asset('banner-light.png') : asset('storage/image/setting/' . $this->attributes['meta_banner']);
    }

    public function getFullPathLogoAttribute()
    {
        return $this->attributes['app_logo'] == null ? asset('logo-light.svg') : asset('storage/image/setting/' . $this->attributes['app_logo']);
    }

    public function getFullPathLogoDarkAttribute()
    {
        return $this->attributes['app_logo_dark'] == null ? asset('logo-dark.svg') : asset('storage/image/setting/' . $this->attributes['app_logo_dark']);
    }

    public function getFullPathFaviconAttribute()
    {
        return $this->attributes['app_favicon'] == null ? asset('favicon-light.png') : asset('storage/image/setting/' . $this->attributes['app_favicon']);
    }
}
