<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\SkillController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/about', [PortfolioController::class, 'about']);

Route::post('/admin/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/me', [AuthController::class, 'me']);

    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);

    Route::get('/admin/skills', [SkillController::class, 'index']);
    Route::post('/admin/skills', [SkillController::class, 'store']);
    Route::delete('/admin/skills/{skill}', [SkillController::class, 'destroy']);

    Route::get('/admin/projects', [ProjectController::class, 'index']);
    Route::post('/admin/projects', [ProjectController::class, 'store']);
    Route::put('/admin/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/admin/projects/{project}', [ProjectController::class, 'destroy']);
});
