<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCollectionElement extends Model
{
    protected $fillable = [
        'user_collection_id',
        'element',
        'current',
    ];

    protected $casts = [
        'current' => 'integer',
    ];

    public function userCollection(): BelongsTo
    {
        return $this->belongsTo(UserCollection::class);
    }
}
