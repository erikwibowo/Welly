<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'user delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'user update', 'guard_name' => 'web']);
        Permission::create(['name' => 'user read', 'guard_name' => 'web']);
        Permission::create(['name' => 'user create', 'guard_name' => 'web']);

        Permission::create(['name' => 'role delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'role update', 'guard_name' => 'web']);
        Permission::create(['name' => 'role read', 'guard_name' => 'web']);
        Permission::create(['name' => 'role create', 'guard_name' => 'web']);

        Permission::create(['name' => 'permission delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'permission update', 'guard_name' => 'web']);
        Permission::create(['name' => 'permission read', 'guard_name' => 'web']);
        Permission::create(['name' => 'permission create', 'guard_name' => 'web']);

        Permission::create(['name' => 'setting read', 'guard_name' => 'web']);
        Permission::create(['name' => 'setting update', 'guard_name' => 'web']);

        Permission::create(['name' => 'asset delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'asset update', 'guard_name' => 'web']);
        Permission::create(['name' => 'asset read', 'guard_name' => 'web']);
        Permission::create(['name' => 'asset create', 'guard_name' => 'web']);

        Permission::create(['name' => 'category delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'category update', 'guard_name' => 'web']);
        Permission::create(['name' => 'category read', 'guard_name' => 'web']);
        Permission::create(['name' => 'category create', 'guard_name' => 'web']);

        Permission::create(['name' => 'transaction delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'transaction update', 'guard_name' => 'web']);
        Permission::create(['name' => 'transaction read', 'guard_name' => 'web']);
        Permission::create(['name' => 'transaction create', 'guard_name' => 'web']);
    }
}
