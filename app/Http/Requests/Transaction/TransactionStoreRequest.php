<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class TransactionStoreRequest extends FormRequest
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
            'category_id' => ['required'],
            'from_asset_id' => ['required_unless:type,transfer'],
            'to_asset_id' => ['required_if:type,transfer'],
            'type' => ['required', 'string', 'in:income,expense,transfer'],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric'],
            'note' => ['nullable', 'string'],
        ];
    }
}
