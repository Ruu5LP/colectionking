<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\CardElement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CardsJsonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seed_data/cards.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("Cards JSON file not found at: {$jsonPath}");
            return;
        }

        $cardsData = json_decode(File::get($jsonPath), true);

        if (!is_array($cardsData)) {
            $this->command->error("Invalid JSON format in cards.json");
            return;
        }

        foreach ($cardsData as $cardData) {
            // Extract elements data before creating/updating card
            $elements = $cardData['elements'] ?? [];
            unset($cardData['elements']);

            // Create or update card
            $card = Card::updateOrCreate(
                ['id' => $cardData['id']],
                [
                    'name' => $cardData['name'],
                    'hp' => $cardData['hp'],
                    'atk' => $cardData['atk'],
                    'def' => $cardData['def'],
                    'rarity' => $cardData['rarity'],
                    'description' => $cardData['description'] ?? null,
                    'image_url' => $cardData['image_url'] ?? null,
                ]
            );

            // Create or update card elements
            foreach ($elements as $elementData) {
                CardElement::updateOrCreate(
                    [
                        'card_id' => $card->id,
                        'element' => $elementData['element'],
                    ],
                    [
                        'base' => $elementData['base'],
                        'cap' => $elementData['cap'],
                    ]
                );
            }

            $this->command->info("Seeded card: {$card->id} - {$card->name}");
        }

        $this->command->info("Cards seeding completed!");
    }
}
