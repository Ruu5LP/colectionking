# Starter Card Distribution Implementation

This document describes the implementation of the starter card distribution system for new user registration.

## Overview

When a new user registers, they automatically receive 4 starter cards, each with a quantity of 3 copies. This allows new players to immediately build a deck and start playing.

## Database Schema

### user_collections Table
Replaces the individual card tracking system with quantity-based collection management.

```
- id (bigint, PK)
- user_id (FK -> users.id)
- card_id (string, FK -> cards.id)
- quantity (int, default 1)
- timestamps
- Unique constraint: (user_id, card_id)
```

### user_collection_elements Table
Tracks element values for each user's card collection.

```
- id (bigint, PK)
- user_collection_id (bigint, FK -> user_collections.id)
- element (string(16)) // fire/water/wind/earth/mech
- current (tinyint 0-100)
- timestamps
- Unique constraint: (user_collection_id, element)
- Index on: element
```

## Starter Cards

Four starter cards are seeded into the database:

1. **ルークス【スターター】** (STARTER001)
   - HP: 600, ATK: 180, DEF: 180, Rarity: 2
   - Elements: fire=5/5, water=3/3, wind=1/3, earth=1/3, mech=5/5

2. **アーヤ【スターター】** (STARTER002)
   - HP: 600, ATK: 180, DEF: 170, Rarity: 2
   - Elements: fire=2/3, water=5/5, wind=2/3, earth=2/3, mech=2/3

3. **見習い兵士【スターター】** (STARTER003)
   - HP: 500, ATK: 150, DEF: 150, Rarity: 1
   - Elements: fire=2/3, water=2/3, wind=5/5, earth=1/3, mech=2/3

4. **見習い魔術師【スターター】** (STARTER004)
   - HP: 500, ATK: 150, DEF: 150, Rarity: 1
   - Elements: fire=2/3, water=1/3, wind=3/3, earth=5/5, mech=1/3

Note: Element format is base/cap. Current values are initialized to base values.

## Implementation Components

### Backend (Laravel)

1. **Migrations**
   - `2026_01_02_000001_create_user_collections_table.php`
   - `2026_01_02_000002_create_user_collection_elements_table.php`

2. **Models**
   - `app/Models/UserCollection.php` - Manages user card collections with quantity
   - `app/Models/UserCollectionElement.php` - Manages element values for collections

3. **Service**
   - `app/Services/StarterCardService.php` - Handles starter card distribution
     - `distributeStarterCards(User $user)` - Main distribution method
     - Idempotent: Won't duplicate cards if called multiple times
     - Creates user_collections entries with quantity=3
     - Initializes elements with base values from card_elements

4. **Controllers**
   - `app/Http/Controllers/AuthController.php`
     - Updated `register()` to call StarterCardService after user creation
   - `app/Http/Controllers/UserCardController.php`
     - Updated `index()` to use user_collections instead of user_cards
     - Returns cards with quantity field

5. **Seed Data**
   - `database/seed_data/cards.json` - Contains all card data including starters
   - `database/seeders/CardsJsonSeeder.php` - Seeds cards from JSON file

### Frontend (React + TypeScript)

1. **Types** (`resources/js/types/index.ts`)
   - Added `quantity` field to `UserCard` interface
   - Changed `user_card_id` to `user_collection_id`

2. **Components**
   - `resources/js/components/CardGrid.tsx`
     - Added `showQuantity` prop to display quantity badge
     - Shows "used/quantity" when building decks
   
3. **Pages**
   - `resources/js/pages/Collection.tsx`
     - Uses `/api/user/cards` endpoint
     - Displays quantity for each card
   
   - `resources/js/pages/Deck.tsx`
     - Uses `/api/user/cards` endpoint
     - Respects quantity limits when adding cards to deck
     - Allows multiple copies of same card up to quantity limit

## API Endpoints

### GET /api/user/cards (auth:sanctum)
Returns the authenticated user's card collection with quantities.

Response format:
```json
[
  {
    "id": "STARTER001",
    "name": "ルークス【スターター】",
    "hp": 600,
    "atk": 180,
    "def": 180,
    "rarity": 2,
    "description": "スターターカード",
    "image_url": null,
    "user_collection_id": 1,
    "quantity": 3,
    "elements": {
      "fire": {"base": 5, "cap": 5, "current": 5},
      "water": {"base": 3, "cap": 3, "current": 3},
      "wind": {"base": 1, "cap": 3, "current": 1},
      "earth": {"base": 1, "cap": 3, "current": 1},
      "mech": {"base": 5, "cap": 5, "current": 5}
    }
  },
  ...
]
```

### GET /api/cards
Returns all available cards (unchanged, for browsing all cards).

## Setup Instructions

1. **Run Migrations**
   ```bash
   php artisan migrate
   ```

2. **Seed Starter Cards**
   ```bash
   php artisan db:seed --class=CardsJsonSeeder
   ```

3. **Test Registration**
   - Register a new user via `/register` endpoint or UI
   - The user will automatically receive 4 starter cards with quantity=3 each
   - Verify by calling `/api/user/cards` (requires authentication)

4. **Build Frontend**
   ```bash
   npm install
   npm run build
   ```

## Features

### Idempotency
The starter distribution service is idempotent - calling it multiple times for the same user won't create duplicate cards. It checks if the user already has any starter cards before distribution.

### Quantity Management
- Users can have multiple copies of the same card
- Deck builder respects quantity limits
- UI shows quantity badges on cards
- Collection page displays owned quantity

### Element System
- 5 elements: fire, water, wind, earth, mech
- Each card has base and cap values per element
- User collections track current values per element
- Missing elements default to 0

## Testing Checklist

- [ ] Migrations run successfully
- [ ] Starter cards are seeded correctly
- [ ] New user registration creates user_collections entries
- [ ] `/api/user/cards` returns correct data with quantities
- [ ] Collection page displays cards with quantity badges
- [ ] Deck builder allows adding multiple copies up to quantity limit
- [ ] Deck builder prevents adding more copies than owned
- [ ] Rarity stars display correctly
- [ ] Element bars display correctly

## Notes

- The old `user_cards` and `user_card_elements` tables remain in the database for backwards compatibility but are not used by new code
- Element order is always: fire, water, wind, earth, mech
- Quantity field allows for future expansion (e.g., gacha system, card acquisition)
- The implementation follows Laravel best practices with service layer separation
