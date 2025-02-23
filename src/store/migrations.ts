import { MigrationManifest } from 'redux-persist';

import { PreferredView } from '@/types/dashboard';

// TODO: migrate to redux persist idb storage
// import localforage from 'localforage';
// import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src';

// async function migrateLocalForageData() {
//   try {
//     const allKeys = await localforage.keys();
//     const migratedData = {} as Record<string, string | null>;

//     for (const key of allKeys) {
//       migratedData[key] = await localforage.getItem(key);
//     }

//     return migratedData;
//   } catch (error) {
//     console.error('Migration error:', error);
//     return null;
//   }
// }

// const idbStorage = createIdbStorage({
//   name: 'AuraStorage',
//   storeName: 'keyval',
// });

// async function migrateToIDBStorage(): Promise<any> {
//   const migratedData = await migrateLocalForageData();
//   if (migratedData) {
//     for (const [key, value] of Object.entries(migratedData)) {
//       await idbStorage.setItem(key, value);
//     }
//     console.log('Migration complete.');
//   }

//   return migratedData;
// }

export const migrations: MigrationManifest = {
  1: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        splashScreenShown: false,
        playerOnboardingScreenShown: false,
      },
    };
  },
  2: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        preferredView: PreferredView.PLAYER,
      },
    };
  },
  3: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        authData: oldState.profile.authData
          ? {
              brightId: oldState.profile.authData.brightId,
              password: oldState.profile.authData.password,
            }
          : null,
      },
    };
  },
  4: (oldState: any) => {
    if (!oldState.keypair) return oldState;

    let newSecretKey = oldState.keypair.secretKey;

    try {
      atob(newSecretKey);
    } catch {
      newSecretKey = btoa(
        String.fromCharCode(...new Uint8Array(oldState.keypair.secretKey)),
      );
    }

    return {
      ...oldState,
      keypair: {
        ...oldState.keypair,
        secretKey: newSecretKey,
      },
    };
  },
};
