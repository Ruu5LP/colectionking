<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'kind',
        'atk',
        'def',
        'element',
    ];

    protected $casts = [
        'atk' => 'integer',
        'def' => 'integer',
    ];
}
