# Card Images Directory

This directory contains card images used by the application.

## File Naming Convention

Card images should be named according to their card ID:
- Format: `{CARD_ID}.{extension}`
- Example: `C001.svg`, `C002.png`, etc.

## Supported Formats

The seeder supports various image formats:
- SVG (`.svg`)
- PNG (`.png`)
- JPG/JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)

## Usage

The `CardsJsonSeeder` automatically scans this directory and assigns image URLs to cards based on their ID. If a card with ID `C001` exists in the database, and a file named `C001.svg` (or any other supported extension) is found in this directory, the seeder will set the card's `image_url` to `/images/C001.svg`.

## Current Images

This directory contains sample SVG images for cards C001 through C010.
