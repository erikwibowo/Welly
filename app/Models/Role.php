<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Role as ModelsRole;

class Role extends ModelsRole
{
    use Searchable;

    protected $fillable = [
        'name',
        'guard_name',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'guard_name' => $this->guard_name,
        ];
    }
}
