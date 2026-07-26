import {
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
} from '../constants/storageKeys';

const migrateStorageEntry = (
  legacyKey,
  newKey,
) => {
  try {
    const existingNewValue =
      localStorage.getItem(newKey);

    const legacyValue =
      localStorage.getItem(legacyKey);

    if (
      existingNewValue === null &&
      legacyValue !== null
    ) {
      localStorage.setItem(
        newKey,
        legacyValue,
      );
    }
  } catch (error) {
    console.error(
      `Unable to migrate localStorage key "${legacyKey}".`,
      error,
    );
  }
};

export const migrateStorageKeys = () => {
  if (typeof window === 'undefined') {
    return;
  }

  Object.keys(STORAGE_KEYS).forEach(
    storageKeyName => {
      const legacyKey =
        LEGACY_STORAGE_KEYS[storageKeyName];

      const newKey =
        STORAGE_KEYS[storageKeyName];

      if (!legacyKey || !newKey) {
        return;
      }

      migrateStorageEntry(
        legacyKey,
        newKey,
      );
    },
  );
};