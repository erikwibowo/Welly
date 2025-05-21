<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class SettingUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->source === 'general') {
            return [
                'app_name' => ['required', 'string', 'max:255'],
                'app_short_name' => ['nullable', 'string', 'max:255'],
                'app_version' => ['nullable', 'string', 'max:255'],
                'app_tagline' => ['nullable', 'string'],
                'app_description' => ['nullable', 'string']
            ];
        }
        if ($this->source === 'seo') {
            return [
                'meta_title' => ['nullable', 'string', 'max:255'],
                'meta_description' => ['nullable', 'string'],
                'meta_banner' => ['nullable', 'max:2048', 'image', 'mimes:svg,jpeg,jpg,png,gif,webp'],
                'meta_keywords' => ['nullable', 'string'],
                'meta_author' => ['nullable', 'string', 'max:255'],
            ];
        }
        if ($this->source === 'image') {
            return [
                'app_favicon' => ['nullable', 'max:2048', 'image', 'mimes:svg,jpeg,jpg,png,gif,webp'],
                'app_logo' => ['nullable', 'max:2048', 'image', 'mimes:svg,jpeg,jpg,png,gif,webp'],
                'app_logo_dark' => ['nullable', 'max:2048', 'image', 'mimes:svg,jpeg,jpg,png,gif,webp'],
            ];
        }
        if ($this->source === 'contact') {
            return [
                'app_email' => ['nullable', 'string', 'email', 'max:255'],
                'app_phone' => ['nullable', 'string', 'max:255'],
                'app_whatsapp' => ['nullable', 'string', 'max:255'],
                'app_facebook' => ['nullable', 'string', 'max:255'],
                'app_instagram' => ['nullable', 'string', 'max:255'],
                'app_twitter' => ['nullable', 'string', 'max:255'],
                'app_tiktok' => ['nullable', 'string', 'max:255'],
                'app_address' => ['nullable', 'string'],
            ];
        }

        return [];
    }
}
