<?php

namespace Database\Seeders;

use App\Models\Card;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $elements = ['FIRE', 'WIND', 'WATER'];

        // Create 20 NORMAL cards
        for ($i = 1; $i <= 20; $i++) {
            Card::create([
                'id' => Str::uuid()->toString(),
                'name' => "Normal Card {$i}",
                'kind' => 'NORMAL',
                'atk' => rand(100, 500),
                'def' => rand(100, 500),
                'element' => null,
            ]);
        }

        // Create 10 SPECIAL cards with elements
        for ($i = 1; $i <= 10; $i++) {
            Card::create([
                'id' => Str::uuid()->toString(),
                'name' => "Special Card {$i}",
                'kind' => 'SPECIAL',
                'atk' => rand(300, 800),
                'def' => rand(300, 800),
                'element' => $elements[array_rand($elements)],
            ]);
        }
    }
}
