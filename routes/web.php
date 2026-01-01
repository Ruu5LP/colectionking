<?php

use Illuminate\Support\Facades\Route;

// SPA entry point - all non-API routes return the React app
// Excludes /api and /up routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|up).*$');
