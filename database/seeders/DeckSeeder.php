<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Deck;
use App\Models\Leader;
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
        // Get all leaders and cards
        $leaders = Leader::all();
        $cards = Card::all();

        if ($leaders->isEmpty() || $cards->count() < 10) {
            $this->command->warn('Not enough leaders or cards to create decks. Please run LeaderSeeder and CardSeeder first.');
            return;
        }

        // Create 3 sample decks with different user_ids
        for ($i = 1; $i <= 3; $i++) {
            // Get a random leader
            $leader = $leaders->random();
            
            // Get 10 random cards
            $selectedCards = $cards->random(10)->pluck('id')->toArray();
            
            Deck::create([
                'user_id' => Str::uuid()->toString(),
                'leader_id' => $leader->id,
                'cards_json' => $selectedCards,
            ]);
        }

        $this->command->info('Created 3 sample decks successfully.');
    }
}
