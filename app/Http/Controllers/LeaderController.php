<?php

namespace App\Http\Controllers;

use App\Models\Leader;
use Illuminate\Http\Request;

class LeaderController extends Controller
{
    public function index()
    {
        $leaders = Leader::all();
        return response()->json($leaders);
    }
}
