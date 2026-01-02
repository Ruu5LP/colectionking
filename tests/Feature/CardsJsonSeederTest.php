<?php

namespace Tests\Feature;

use App\Models\Card;
use Database\Seeders\CardsJsonSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class CardsJsonSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_assigns_image_urls_from_public_images(): void
    {
        // Run the seeder
        $this->seed(CardsJsonSeeder::class);

        // Get all cards from database
        $cards = Card::all();

        // Assert that we have cards
        $this->assertGreaterThan(0, $cards->count());

        // Check that cards have image URLs assigned
        foreach ($cards as $card) {
            // If an image file exists for this card ID, it should have an image URL
            $possibleExtensions = ['svg', 'png', 'jpg', 'jpeg', 'gif'];
            $hasImageFile = false;

            foreach ($possibleExtensions as $ext) {
                $imagePath = public_path("images/{$card->id}.{$ext}");
                if (File::exists($imagePath)) {
                    $hasImageFile = true;
                    // Assert that the image URL matches the file found
                    $this->assertEquals("/images/{$card->id}.{$ext}", $card->image_url);
                    break;
                }
            }

            // If no image file exists, image_url can be null
            if (! $hasImageFile) {
                $this->assertNull($card->image_url);
            }
        }
    }

    public function test_seeder_works_with_existing_cards(): void
    {
        // Run the seeder once
        $this->seed(CardsJsonSeeder::class);

        $firstRunCount = Card::count();

        // Run the seeder again
        $this->seed(CardsJsonSeeder::class);

        $secondRunCount = Card::count();

        // Should have the same number of cards (updateOrCreate should not duplicate)
        $this->assertEquals($firstRunCount, $secondRunCount);
    }
}
