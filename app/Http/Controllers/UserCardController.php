<?php

namespace App\Http\Controllers;

use App\Models\UserCollection;
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

        $userCollections = UserCollection::with(['card.elements', 'elements'])
            ->where('user_id', $user->id)
            ->get();

        // Format user collections with elements as {fire:{base,cap,current}, ...}
        $formattedCards = $userCollections->map(function ($userCollection) {
            $card = $userCollection->card;
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
            
            // Fill in current from user_collection_elements
            foreach ($userCollection->elements as $userCollectionElement) {
                if (isset($elements[$userCollectionElement->element])) {
                    $elements[$userCollectionElement->element]['current'] = $userCollectionElement->current;
                }
            }
            
            $cardArray['elements'] = $elements;
            $cardArray['user_collection_id'] = $userCollection->id;
            $cardArray['quantity'] = $userCollection->quantity;
            
            return $cardArray;
        });

        return response()->json($formattedCards);
    }
}
