<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCardElement extends Model
{
    protected $fillable = [
        'user_card_id',
        'element',
        'current',
    ];

    protected $casts = [
        'current' => 'integer',
    ];

    public function userCard(): BelongsTo
    {
        return $this->belongsTo(UserCard::class);
    }
}
