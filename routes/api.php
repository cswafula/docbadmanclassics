<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaintingController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\AdminPaintingController;

// ── Public routes ──────────────────────────────────────────
Route::prefix('v1')->group(function () {

    Route::get('/paintings',          [PaintingController::class, 'index']);
    Route::get('/paintings/featured', [PaintingController::class, 'featured']);
    Route::get('/paintings/{id}',     [PaintingController::class, 'show']);
    Route::get('/artists',            [PaintingController::class, 'artists']);

    Route::post('/admin/login', [AuthController::class, 'login']);
});

// ── Protected admin routes ─────────────────────────────────
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Paintings CRUD
    Route::get('/paintings',          [AdminPaintingController::class, 'index']);
    Route::get('/paintings/{id}',     [AdminPaintingController::class, 'show']);
    Route::post('/paintings',         [AdminPaintingController::class, 'store']);
    Route::post('/paintings/{id}',    [AdminPaintingController::class, 'update']);
    Route::put('/paintings/{id}',     [AdminPaintingController::class, 'update']);
    Route::delete('/paintings/{id}',  [AdminPaintingController::class, 'destroy']);
});