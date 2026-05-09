<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['profile_id', 'title', 'description', 'image', 'url', 'tags', 'sort_order'];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
