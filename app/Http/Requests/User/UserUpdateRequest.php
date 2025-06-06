<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserUpdateRequest extends FormRequest
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
        return [
            'image' => ['nullable', 'max:2048', 'image', 'mimes:svg,jpeg,jpg,png,gif,webp'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'unique:users,email,' . $this->user->id],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'password_confirmation' => ['sometimes', 'required_with:password', 'same:password'],
            'roles'   => ['array'],
        ];
    }
}
