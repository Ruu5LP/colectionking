<?php

namespace Database\Seeders;

use App\Models\Leader;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaderNames = [
            'Fire King',
            'Water Queen',
            'Wind Master',
            'Earth Guardian',
            'Lightning Lord',
            'Shadow Emperor',
            'Light Sovereign',
            'Ice Princess',
            'Thunder Sage',
            'Storm Warden',
        ];

        foreach ($leaderNames as $name) {
            Leader::create([
                'id' => Str::uuid()->toString(),
                'name' => $name,
                'hp' => rand(700, 1500),
            ]);
        }
    }
}
