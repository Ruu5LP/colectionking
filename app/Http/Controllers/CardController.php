<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Support\Elements;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index()
    {
        $cards = Card::with('elements')->get();
        
        // Format cards with elements as {fire:{base,cap}, ...}
        $formattedCards = $cards->map(function ($card) {
            $cardArray = $card->toArray();
            
            // Initialize all elements with 0 values
            $elements = [];
            foreach (Elements::ALL as $element) {
                $elements[$element] = ['base' => 0, 'cap' => 0];
            }
            
            // Fill in actual values from card_elements
            foreach ($card->elements as $cardElement) {
                $elements[$cardElement->element] = [
                    'base' => $cardElement->base,
                    'cap' => $cardElement->cap,
                ];
            }
            
            $cardArray['elements'] = $elements;
            unset($cardArray['elements_relation']); // Remove the raw relation data if present
            
            return $cardArray;
        });
        
        return response()->json($formattedCards);
    }
}
