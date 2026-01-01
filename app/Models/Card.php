<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'hp',
        'atk',
        'def',
        'rarity',
        'description',
        'image_url',
    ];

    protected $casts = [
        'atk' => 'integer',
        'def' => 'integer',
        'hp' => 'integer',
        'rarity' => 'integer',
    ];

    public function elements(): HasMany
    {
        return $this->hasMany(CardElement::class, 'card_id', 'id');
    }

    public function userCards(): HasMany
    {
        return $this->hasMany(UserCard::class, 'card_id', 'id');
    }
}
