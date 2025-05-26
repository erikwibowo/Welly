<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Asset extends Model
{
    use Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'owner',
        'initial_value',
        'type',
        'note',
    ];

    protected $appends = [
        'type_view',
        'transactions'
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

    /**
     * Get all transactions where this asset is the source.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactionsFrom(): HasMany
    {
        return $this->hasMany(Transaction::class, 'from_asset_id');
    }

    /**
     * Get all transactions where this asset is the destination.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactionsTo(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_asset_id');
    }

    /**
     * Get all transactions related to this asset (both from and to).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTransactionsAttribute()
    {
        return $this->transactionsFrom->merge($this->transactionsTo)->sortByDesc('date')->sortByDesc('created_at')->values();
    }
}
