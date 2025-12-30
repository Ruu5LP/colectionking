<?php

use Illuminate\Support\Facades\Route;

// SPA entry point - all non-API routes return the React app
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
