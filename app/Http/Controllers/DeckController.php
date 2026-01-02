<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeckController extends Controller
{
    public function show($userId)
    {
        $deck = Deck::where('user_id', $userId)->first();
        
        if (!$deck) {
            return response()->json(null);
        }
        
        return response()->json($deck);
    }

    public function store(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'leaderCardId' => 'required|string',
            'cards' => 'required|array|size:10',
            'cards.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate leader card exists
        $leaderCard = Card::find($request->leaderCardId);
        if (!$leaderCard) {
            return response()->json([
                'errors' => ['leaderCardId' => ['The selected leader card does not exist.']]
            ], 422);
        }

        // Validate all cards exist (get unique card IDs)
        $cardIds = $request->cards;
        $uniqueCardIds = array_unique($cardIds);
        $cards = Card::whereIn('id', $uniqueCardIds)->get();
        
        if ($cards->count() !== count($uniqueCardIds)) {
            return response()->json([
                'errors' => ['cards' => ['One or more card IDs are invalid.']]
            ], 422);
        }

        // Upsert deck
        $deck = Deck::updateOrCreate(
            ['user_id' => $userId],
            [
                'leader_card_id' => $request->leaderCardId,
                'cards_json' => $cardIds,
            ]
        );

        return response()->json($deck);
    }
}
