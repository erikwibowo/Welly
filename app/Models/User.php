<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Searchable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'parent_id',
        'image',
        'name',
        'email',
        'password',
    ];



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
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
            'email' => $this->email,
        ];
    }

    protected $appends = [
        'initial',
        'verified_at',
        'full_path_image'
    ];

    public function getInitialAttribute()
    {
        $nameParts = explode(' ', $this->name);
        $initials = '';
        if (count($nameParts) > 2) {
            $initials = Str::substr($nameParts[0], 0, 1) . Str::substr(end($nameParts), 0, 1);
        } else {
            foreach ($nameParts as $part) {
                $initials .= Str::substr($part, 0, 1);
                if (strlen($initials) >= 2) {
                    break;
                }
            }
        }
        return Str::upper($initials);
    }

    public function getFullPathImageAttribute()
    {
        return $this->attributes['image'] == null ? null : asset('storage/image/user/' . $this->attributes['image']);
    }

    public function getVerifiedAtAttribute()
    {
        return $this->attributes['email_verified_at'] == null ? null : Carbon::parse($this->attributes['email_verified_at'])->isoFormat('D MMM Y HH:mm');
    }

    public function getUserPermissions()
    {
        return $this->getAllPermissions()->mapWithKeys(fn($permission) => [$permission['name'] => true]);
    }
}
