<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Deck;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DeckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all cards
        $cards = Card::all();

        if ($cards->count() < 11) {
            $this->command->warn('Not enough cards to create decks. Please run CardSeeder first.');
            return;
        }

        // Create 3 sample decks with different user_ids
        for ($i = 1; $i <= 3; $i++) {
            // Get a random card as leader
            $leaderCard = $cards->random();
            
            // Get 10 random cards for the deck
            $selectedCards = $cards->random(10)->pluck('id')->toArray();
            
            Deck::create([
                'user_id' => Str::uuid()->toString(),
                'leader_card_id' => $leaderCard->id,
                'cards_json' => $selectedCards,
            ]);
        }

        $this->command->info('Created 3 sample decks successfully.');
    }
}
