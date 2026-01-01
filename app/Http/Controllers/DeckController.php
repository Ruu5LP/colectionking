<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Deck;
use App\Models\Leader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeckController extends Controller
{
    /**
     * Format deck data for JSON response.
     *
     * @param Deck $deck
     * @return array
     */
    private function formatDeckResponse(Deck $deck): array
    {
        return [
            'id' => $deck->id,
            'user_id' => $deck->user_id,
            'leader_id' => $deck->leader_id,
            'cards_json' => is_array($deck->cards_json) ? $deck->cards_json : [],
            'created_at' => $deck->created_at,
            'updated_at' => $deck->updated_at,
        ];
    }

    public function show($userId)
    {
        $deck = Deck::where('user_id', $userId)->first();
        
        if (!$deck) {
            return response()->json(null);
        }
        
        return response()->json($this->formatDeckResponse($deck));
    }

    public function store(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'leaderId' => 'required|string',
            'cards' => 'required|array|size:10',
            'cards.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate leader exists
        $leader = Leader::find($request->leaderId);
        if (!$leader) {
            return response()->json([
                'errors' => ['leaderId' => ['The selected leader does not exist.']]
            ], 422);
        }

        // Validate all cards exist
        $cardIds = $request->cards;
        $cards = Card::whereIn('id', $cardIds)->get();
        
        if ($cards->count() !== 10) {
            return response()->json([
                'errors' => ['cards' => ['One or more card IDs are invalid.']]
            ], 422);
        }

        // Upsert deck
        $deck = Deck::updateOrCreate(
            ['user_id' => $userId],
            [
                'leader_id' => $request->leaderId,
                'cards_json' => $cardIds,
            ]
        );

        return response()->json($this->formatDeckResponse($deck));
    }
}
