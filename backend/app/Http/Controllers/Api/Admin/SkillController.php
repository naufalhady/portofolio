<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(): JsonResponse
    {
        $profile = Profile::firstOrFail();
        return response()->json(['status' => 'success', 'data' => $profile->skills]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $profile = Profile::firstOrFail();
        $maxOrder = $profile->skills()->max('sort_order') ?? 0;

        $skill = $profile->skills()->create([
            'name' => $validated['name'],
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['status' => 'success', 'data' => $skill], 201);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();
        return response()->json(['status' => 'success']);
    }
}
