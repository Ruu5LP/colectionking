<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    protected $fillable = [
        'user_id',
        'leader_id',
        'cards_json',
    ];

    protected $casts = [
        'cards_json' => 'array',
    ];
}
