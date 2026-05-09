<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $profile = Profile::firstOrFail();
        return response()->json(['status' => 'success', 'data' => $profile->projects]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        $profile = Profile::firstOrFail();
        $maxOrder = $profile->projects()->max('sort_order') ?? 0;

        $project = $profile->projects()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'tags' => $validated['tags'] ?? [],
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['status' => 'success', 'data' => $project], 201);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        $project->update($validated);

        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();
        return response()->json(['status' => 'success']);
    }
}
