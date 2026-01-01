<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardElement extends Model
{
    protected $fillable = [
        'card_id',
        'element',
        'base',
        'cap',
    ];

    protected $casts = [
        'base' => 'integer',
        'cap' => 'integer',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class, 'card_id', 'id');
    }
}
