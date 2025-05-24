<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Transaction extends Model
{
    use Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'from_asset_id',
        'to_asset_id',
        'type',
        'date',
        'amount',
        'note',
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
        } else if ($this->attributes['type'] == 'transfer') {
            return "Transfer";
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
            'type' => $this->type,
            'date' => $this->date,
            'amount' => $this->amount,
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
     * Get the category that owns the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the from that owns the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function from(): BelongsTo
    {
        return $this->belongsTo(Asset::class, 'from_asset_id', 'id');
    }

    /**
     * Get the to that owns the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function to(): BelongsTo
    {
        return $this->belongsTo(Asset::class, 'to_asset_id', 'id');
    }
}
