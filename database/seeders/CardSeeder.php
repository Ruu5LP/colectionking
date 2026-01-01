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
                'atk' => rand(10, 50),
                'def' => rand(10, 50),
                'hp' => rand(100, 200),
                'element' => null,
            ]);
        }

        // Create 10 SPECIAL cards with elements
        for ($i = 1; $i <= 10; $i++) {
            Card::create([
                'id' => Str::uuid()->toString(),
                'name' => "Special Card {$i}",
                'kind' => 'SPECIAL',
                'atk' => rand(30, 80),
                'def' => rand(30, 80),
                'hp' => rand(150, 300),
                'element' => $elements[array_rand($elements)],
            ]);
        }
    }
}
