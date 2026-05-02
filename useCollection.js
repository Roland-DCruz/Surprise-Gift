// hooks/useCollection.js
import { useState, useCallback } from 'react';
import { loadCollection, saveCollection, addGiftToCollection } from '../systems/GiftSystem';

export function useCollection() {
  const [collection, setCollection] = useState(() => loadCollection());

  const addGift = useCallback((giftId) => {
    setCollection(prev => {
      const next = addGiftToCollection(prev, giftId);
      saveCollection(next);
      return next;
    });
  }, []);

  const clearCollection = useCallback(() => {
    setCollection([]);
    saveCollection([]);
  }, []);

  return { collection, addGift, clearCollection };
}
