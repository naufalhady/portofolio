<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;

class PortfolioController extends Controller
{
    public function index()
    {
        $profile = Profile::with(['skills', 'projects'])->first();

        if (!$profile) {
            return response()->json(['status' => 'error', 'message' => 'No portfolio data'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'name' => $profile->name,
                'tagline' => $profile->tagline,
                'skills' => $profile->skills->pluck('name'),
                'projects' => $profile->projects->map(fn($p) => [
                    'title' => $p->title,
                    'description' => $p->description,
                    'tags' => $p->tags ?? [],
                ]),
            ],
        ]);
    }

    public function about()
    {
        $profile = Profile::first();

        if (!$profile) {
            return response()->json(['status' => 'error', 'message' => 'No profile found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'bio' => $profile->bio,
                'location' => $profile->location,
            ],
        ]);
    }
}
