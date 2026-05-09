<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name', 'tagline', 'bio', 'location',
        'email', 'github', 'linkedin', 'avatar',
    ];

    public function skills()
    {
        return $this->hasMany(Skill::class)->orderBy('sort_order');
    }

    public function projects()
    {
        return $this->hasMany(Project::class)->orderBy('sort_order');
    }
}
