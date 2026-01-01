<?php

namespace App\Console\Commands;

use App\Models\Card;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardElement;
use Illuminate\Console\Command;

class GrantAllCardsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cards:grant-all 
                            {--email= : The email of the user}
                            {--id= : The ID of the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Grant all cards to a specified user (by email or ID)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $userId = $this->option('id');

        if (!$email && !$userId) {
            $this->error('Please provide either --email or --id option');
            return 1;
        }

        // Find user
        $user = null;
        if ($email) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->error("User not found with email: {$email}");
                return 1;
            }
        } elseif ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User not found with ID: {$userId}");
                return 1;
            }
        }

        $this->info("Granting all cards to user: {$user->email} (ID: {$user->id})");

        // Get all cards with their elements
        $cards = Card::with('elements')->get();

        if ($cards->isEmpty()) {
            $this->warn('No cards found in database. Please run seeders first.');
            return 1;
        }

        $grantedCount = 0;
        $skippedCount = 0;

        foreach ($cards as $card) {
            // Create or get user_card
            $userCard = UserCard::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'card_id' => $card->id,
                ]
            );

            $wasRecentlyCreated = $userCard->wasRecentlyCreated;

            // Create or update user_card_elements with initial values from card_elements
            foreach ($card->elements as $cardElement) {
                UserCardElement::updateOrCreate(
                    [
                        'user_card_id' => $userCard->id,
                        'element' => $cardElement->element,
                    ],
                    [
                        'current' => $cardElement->base,
                    ]
                );
            }

            if ($wasRecentlyCreated) {
                $grantedCount++;
                $this->info("  ✓ Granted: {$card->id} - {$card->name}");
            } else {
                $skippedCount++;
                $this->comment("  - Already owned: {$card->id} - {$card->name}");
            }
        }

        $this->newLine();
        $this->info("Completed!");
        $this->info("Granted: {$grantedCount} cards");
        $this->info("Already owned: {$skippedCount} cards");
        $this->info("Total: " . ($grantedCount + $skippedCount) . " cards");

        return 0;
    }
}
