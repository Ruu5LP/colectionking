<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Deck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_cards_returns_all_cards(): void
    {
        // Create test cards
        Card::create([
            'id' => Str::uuid()->toString(),
            'name' => 'Test Card 1',
            'kind' => 'NORMAL',
            'atk' => 300,
            'def' => 200,
            'hp' => 1000,
            'element' => null,
        ]);
        Card::create([
            'id' => Str::uuid()->toString(),
            'name' => 'Test Card 2',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1200,
            'element' => 'FIRE',
        ]);

        $response = $this->get('/api/cards');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }

    public function test_get_deck_returns_null_when_no_deck_exists(): void
    {
        $response = $this->get('/api/decks/user123');

        $response->assertStatus(200);
        $this->assertEquals('{}', $response->content());
    }

    public function test_get_deck_returns_deck_when_exists(): void
    {
        $leaderCardId = Str::uuid()->toString();
        Card::create([
            'id' => $leaderCardId,
            'name' => 'Leader Card',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1000,
            'element' => 'FIRE',
        ]);

        $cardIds = [];
        for ($i = 0; $i < 10; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            $cardIds[] = $cardId;
        }

        Deck::create([
            'user_id' => 'user123',
            'leader_card_id' => $leaderCardId,
            'cards_json' => $cardIds,
        ]);

        $response = $this->get('/api/decks/user123');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'user_id',
            'leader_card_id',
            'cards_json',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_post_deck_validates_10_cards_required(): void
    {
        $leaderCardId = Str::uuid()->toString();
        Card::create([
            'id' => $leaderCardId,
            'name' => 'Leader Card',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1000,
            'element' => 'FIRE',
        ]);

        // Only 5 cards instead of 10
        $cardIds = [];
        for ($i = 0; $i < 5; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            $cardIds[] = $cardId;
        }

        $response = $this->postJson('/api/decks/user123', [
            'leaderCardId' => $leaderCardId,
            'cards' => $cardIds,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['cards']);
    }

    public function test_post_deck_validates_leader_card_exists(): void
    {
        $cardIds = [];
        for ($i = 0; $i < 10; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            $cardIds[] = $cardId;
        }

        $response = $this->postJson('/api/decks/user123', [
            'leaderCardId' => 'non-existent-card-id',
            'cards' => $cardIds,
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'errors' => [
                'leaderCardId' => ['The selected leader card does not exist.']
            ]
        ]);
    }

    public function test_post_deck_validates_all_cards_exist(): void
    {
        $leaderCardId = Str::uuid()->toString();
        Card::create([
            'id' => $leaderCardId,
            'name' => 'Leader Card',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1000,
            'element' => 'FIRE',
        ]);

        // Create only 5 real cards
        $cardIds = [];
        for ($i = 0; $i < 5; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            $cardIds[] = $cardId;
        }

        // Add 5 fake card IDs
        for ($i = 0; $i < 5; $i++) {
            $cardIds[] = 'fake-card-' . $i;
        }

        $response = $this->postJson('/api/decks/user123', [
            'leaderCardId' => $leaderCardId,
            'cards' => $cardIds,
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'errors' => [
                'cards' => ['One or more card IDs are invalid.']
            ]
        ]);
    }

    public function test_post_deck_creates_new_deck(): void
    {
        $leaderCardId = Str::uuid()->toString();
        Card::create([
            'id' => $leaderCardId,
            'name' => 'Leader Card',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1000,
            'element' => 'FIRE',
        ]);

        $cardIds = [];
        for ($i = 0; $i < 10; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            $cardIds[] = $cardId;
        }

        $response = $this->postJson('/api/decks/user123', [
            'leaderCardId' => $leaderCardId,
            'cards' => $cardIds,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'user_id',
            'leader_card_id',
            'cards_json',
            'created_at',
            'updated_at',
        ]);

        $this->assertDatabaseHas('decks', [
            'user_id' => 'user123',
            'leader_card_id' => $leaderCardId,
        ]);
    }

    public function test_post_deck_updates_existing_deck(): void
    {
        $leaderCardId1 = Str::uuid()->toString();
        $leaderCardId2 = Str::uuid()->toString();
        Card::create([
            'id' => $leaderCardId1,
            'name' => 'Leader Card 1',
            'kind' => 'SPECIAL',
            'atk' => 500,
            'def' => 400,
            'hp' => 1000,
            'element' => 'FIRE',
        ]);
        Card::create([
            'id' => $leaderCardId2,
            'name' => 'Leader Card 2',
            'kind' => 'SPECIAL',
            'atk' => 600,
            'def' => 500,
            'hp' => 1200,
            'element' => 'WATER',
        ]);

        $cardIds1 = [];
        $cardIds2 = [];
        for ($i = 0; $i < 20; $i++) {
            $cardId = Str::uuid()->toString();
            Card::create([
                'id' => $cardId,
                'name' => "Card {$i}",
                'kind' => 'NORMAL',
                'atk' => 300,
                'def' => 200,
                'hp' => 800,
                'element' => null,
            ]);
            if ($i < 10) {
                $cardIds1[] = $cardId;
            } else {
                $cardIds2[] = $cardId;
            }
        }

        // Create initial deck
        $this->postJson('/api/decks/user123', [
            'leaderCardId' => $leaderCardId1,
            'cards' => $cardIds1,
        ]);

        // Update deck
        $response = $this->postJson('/api/decks/user123', [
            'leaderCardId' => $leaderCardId2,
            'cards' => $cardIds2,
        ]);

        $response->assertStatus(200);

        // Should still have only one deck for this user
        $this->assertEquals(1, Deck::where('user_id', 'user123')->count());

        // But it should have the new leader card
        $this->assertDatabaseHas('decks', [
            'user_id' => 'user123',
            'leader_card_id' => $leaderCardId2,
        ]);
    }
}
