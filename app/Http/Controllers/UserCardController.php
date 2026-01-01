<?php

namespace App\Http\Controllers;

use App\Models\UserCard;
use App\Support\Elements;
use Illuminate\Http\Request;

class UserCardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userCards = UserCard::with(['card.elements', 'elements'])
            ->where('user_id', $user->id)
            ->get();

        // Format user cards with elements as {fire:{base,cap,current}, ...}
        $formattedCards = $userCards->map(function ($userCard) {
            $card = $userCard->card;
            $cardArray = $card->toArray();
            
            // Initialize all elements with 0 values
            $elements = [];
            foreach (Elements::ALL as $element) {
                $elements[$element] = ['base' => 0, 'cap' => 0, 'current' => 0];
            }
            
            // Fill in base and cap from card_elements
            foreach ($card->elements as $cardElement) {
                $elements[$cardElement->element]['base'] = $cardElement->base;
                $elements[$cardElement->element]['cap'] = $cardElement->cap;
            }
            
            // Fill in current from user_card_elements
            foreach ($userCard->elements as $userCardElement) {
                if (isset($elements[$userCardElement->element])) {
                    $elements[$userCardElement->element]['current'] = $userCardElement->current;
                }
            }
            
            $cardArray['elements'] = $elements;
            $cardArray['user_card_id'] = $userCard->id;
            
            return $cardArray;
        });

        return response()->json($formattedCards);
    }
}
