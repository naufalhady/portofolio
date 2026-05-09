<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = Profile::with(['skills', 'projects'])->first();

        if (!$profile) {
            return response()->json(['status' => 'error', 'message' => 'No profile found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile->toArray(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $profile = Profile::firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'tagline' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'github' => 'sometimes|string|max:255',
            'linkedin' => 'sometimes|string|max:255',
        ]);

        $profile->update($validated);
        $profile->load(['skills', 'projects']);

        return response()->json(['status' => 'success', 'data' => $profile]);
    }
}
