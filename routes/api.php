<?php

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
