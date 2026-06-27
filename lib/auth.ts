import { Platform } from 'react-native';

const TOKEN_KEY = 'quickstore_auth_token';

const isWeb = Platform.OS === 'web';

export const saveToken = async (token: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    const { setItemAsync } = await import('expo-secure-store');
    await setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem(TOKEN_KEY);
  }
  const { getItemAsync } = await import('expo-secure-store');
  return await getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    const { deleteItemAsync } = await import('expo-secure-store');
    await deleteItemAsync(TOKEN_KEY);
  }
};
