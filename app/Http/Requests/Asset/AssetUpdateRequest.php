<?php

namespace App\Http\Requests\Asset;

use Illuminate\Foundation\Http\FormRequest;

class AssetUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'owner' => ['required', 'string', 'max:255'],
            'initial_value' => ['required', 'numeric'],
            'type' => ['required', 'string', 'in:asset,liability'],
            'note' => ['nullable', 'string'],
        ];
    }
}
