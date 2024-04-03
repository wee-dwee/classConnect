import React from 'react';
import CreateCard from './CreateCard.js';

export default function Dummy() {
  // Define the number of cards you want to create
  const numberOfCards = 1; // Change this value as needed

  // Create an array of specified length filled with `null` values
  const cards = Array.from({ length: numberOfCards }, (_, index) => index);

  return (
    <div>
      {/* Map through the `cards` array and render a `CreateCard` component for each element */}
      {cards.map((card, index) => (
        <CreateCard key={index} />
      ))}
    </div>
  );
}
