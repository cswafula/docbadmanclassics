<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaintingController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\AdminPaintingController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\PesaPalController;
use App\Http\Controllers\Api\DeliveryRegionController;
use App\Http\Controllers\Api\Admin\AdminDeliveryRegionController;
use App\Http\Controllers\Api\Admin\AdminUserController;

// ── Public routes ──────────────────────────────────────────
Route::prefix('v1')->group(function () {

    Route::get('/paintings',          [PaintingController::class, 'index']);
    Route::get('/paintings/featured', [PaintingController::class, 'featured']);
    Route::get('/paintings/{id}',     [PaintingController::class, 'show']);
    Route::get('/artists',            [PaintingController::class, 'artists']);

    Route::post('/admin/login', [AuthController::class, 'login']);
    Route::post('/orders',      [OrderController::class, 'store']);

    // PesaPal
    Route::post('/pesapal/initiate',  [PesaPalController::class, 'initiatePayment']);
    Route::get('/pesapal/ipn',        [PesaPalController::class, 'ipn']);

    Route::get('/delivery-regions', [DeliveryRegionController::class, 'index']);

    Route::get('/pesapal/verify', [PesaPalController::class, 'verify']);
});

    // ── Protected admin routes ─────────────────────────────────
    Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Paintings CRUD
    Route::get('/paintings',         [AdminPaintingController::class, 'index']);
    Route::get('/paintings/{id}',    [AdminPaintingController::class, 'show']);
    Route::post('/paintings',        [AdminPaintingController::class, 'store']);
    Route::post('/paintings/{id}',   [AdminPaintingController::class, 'update']);
    Route::put('/paintings/{id}',    [AdminPaintingController::class, 'update']);
    Route::delete('/paintings/{id}', [AdminPaintingController::class, 'destroy']);

    // Orders
    Route::get('/orders/stats',         [AdminOrderController::class, 'stats']);
    Route::get('/orders',               [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}',          [AdminOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

    // Delivery Regions
    Route::get('/delivery-regions',       [AdminDeliveryRegionController::class, 'index']);
    Route::post('/delivery-regions',      [AdminDeliveryRegionController::class, 'store']);
    Route::put('/delivery-regions/{id}',  [AdminDeliveryRegionController::class, 'update']);
    Route::delete('/delivery-regions/{id}', [AdminDeliveryRegionController::class, 'destroy']);

    // Users
    Route::get('/users',                    [AdminUserController::class, 'index']);
    Route::post('/users',                   [AdminUserController::class, 'store']);
    Route::patch('/users/{id}/password',    [AdminUserController::class, 'updatePassword']);
    Route::delete('/users/{id}',            [AdminUserController::class, 'destroy']);
});