<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Asset extends Model
{
    use Searchable;

    protected $fillable = [
        'user_id',
        'name',
        'owner',
        'initial_value',
        'type',
        'note',
    ];

    protected $appends = [
        'type_view'
    ];

    public function getTypeViewAttribute()
    {
        if ($this->attributes['type'] == 'asset') {
            return "Aset";
        } else if ($this->attributes['type'] == 'liability') {
            return "Liabilitas";
        } else {
            return "Tidak Diketahui";
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
            'owner' => $this->owner,
            'initial_value' => $this->initial_value,
            'note' => $this->note,
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
