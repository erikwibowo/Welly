<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Permission as ModelsPermission;

class Permission extends ModelsPermission
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

    public static function getDataByGroupSuperadmin()
    {
        $permissions = self::orderBy('name')->get();

        // Initialize an empty array to store the grouped data
        $groupedData = [];

        foreach ($permissions as $permission) {
            // Extract the group and data from the permission name
            $parts = explode(' ', $permission->name);
            $group = $parts[0];
            $data = $parts[1] ?? '';

            // Check if the group already exists in the groupedData array
            $groupIndex = array_search($group, array_column($groupedData, 'group'));

            if ($groupIndex !== false) {
                // If the group exists, append the data to its 'data' array
                $groupedData[$groupIndex]['data'][] = ['id' => $permission->id, 'name' => $data];
            } else {
                // If the group doesn't exist, add a new entry to the groupedData array
                $groupedData[] = [
                    'group' => $group,
                    'data' => [['id' => $permission->id, 'name' => $data]],
                ];
            }
        }

        return $groupedData;
    }

    public static function getDataByGroup()
    {
        $permissions = self::orderBy('name')->whereNotIn('name', ['permission create', 'permission read', 'permission update', 'permission delete'])->get();

        // Initialize an empty array to store the grouped data
        $groupedData = [];

        foreach ($permissions as $permission) {
            // Extract the group and data from the permission name
            $parts = explode(' ', $permission->name);
            $group = $parts[0];
            $data = $parts[1];

            // Check if the group already exists in the groupedData array
            $groupIndex = array_search($group, array_column($groupedData, 'group'));

            if ($groupIndex !== false) {
                // If the group exists, append the data to its 'data' array
                $groupedData[$groupIndex]['data'][] = ['id' => $permission->id, 'name' => $data];
            } else {
                // If the group doesn't exist, add a new entry to the groupedData array
                $groupedData[] = [
                    'group' => $group,
                    'data' => [['id' => $permission->id, 'name' => $data]],
                ];
            }
        }

        return $groupedData;
    }
}
