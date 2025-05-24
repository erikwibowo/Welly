<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Category extends Model
{
    use Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'type',
    ];

    protected $appends = [
        'type_view'
    ];

    public function getTypeViewAttribute()
    {
        if ($this->attributes['type'] == 'income') {
            return "Pemasukan";
        } else if ($this->attributes['type'] == 'expense') {
            return "Pengeluaran";
        }
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
        ];
    }

    /**
     * Get the user that owns the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
