<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\UserCardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Sample API endpoint
Route::get('/user', function (Request $request) {
    return response()->json([
        'name' => 'Sample User',
        'email' => 'user@example.com',
    ]);
});

// Sample API endpoint for testing
Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working!',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);
Route::post('/logout', [AuthController::class, 'logout']);

// Game API endpoints
Route::get('/cards', [CardController::class, 'index']);
Route::get('/decks/{userId}', [DeckController::class, 'show']);
Route::post('/decks/{userId}', [DeckController::class, 'store']);

// Protected user card routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/cards', [UserCardController::class, 'index']);
});
