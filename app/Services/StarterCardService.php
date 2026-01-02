<?php

namespace App\Services;

use App\Models\Card;
use App\Models\User;
use App\Models\UserCollection;
use App\Models\UserCollectionElement;
use App\Support\Elements;
use Illuminate\Support\Facades\DB;

class StarterCardService
{
    /**
     * Starter card IDs
     */
    private const STARTER_CARD_IDS = [
        'STARTER001', // ルークス【スターター】
        'STARTER002', // アーヤ【スターター】
        'STARTER003', // 見習い兵士【スターター】
        'STARTER004', // 見習い魔術師【スターター】
    ];

    /**
     * Number of each starter card to distribute
     */
    private const STARTER_QUANTITY = 3;

    /**
     * Distribute starter cards to a new user.
     * This operation is idempotent - it will not duplicate cards if called multiple times.
     *
     * @param User $user
     * @return void
     */
    public function distributeStarterCards(User $user): void
    {
        // Check if user already has any starter cards (idempotency check)
        $existingStarters = UserCollection::where('user_id', $user->id)
            ->whereIn('card_id', self::STARTER_CARD_IDS)
            ->count();

        if ($existingStarters > 0) {
            // User already has starter cards, skip distribution
            return;
        }

        DB::transaction(function () use ($user) {
            foreach (self::STARTER_CARD_IDS as $cardId) {
                // Get the card to access its base elements
                $card = Card::with('elements')->find($cardId);
                
                if (!$card) {
                    continue; // Skip if card not found
                }

                // Create user collection entry with quantity
                $userCollection = UserCollection::create([
                    'user_id' => $user->id,
                    'card_id' => $cardId,
                    'quantity' => self::STARTER_QUANTITY,
                ]);

                // Create user collection elements initialized with base values
                foreach (Elements::ALL as $element) {
                    // Find the base value from card elements
                    $cardElement = $card->elements->firstWhere('element', $element);
                    $baseValue = $cardElement ? $cardElement->base : 0;

                    UserCollectionElement::create([
                        'user_collection_id' => $userCollection->id,
                        'element' => $element,
                        'current' => $baseValue,
                    ]);
                }
            }
        });
    }
}
