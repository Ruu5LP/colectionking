<?php

use App\Http\Controllers\CardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\LeaderController;
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

// Game API endpoints
Route::get('/leaders', [LeaderController::class, 'index']);
Route::get('/cards', [CardController::class, 'index']);
Route::get('/decks/{userId}', [DeckController::class, 'show']);
Route::post('/decks/{userId}', [DeckController::class, 'store']);
