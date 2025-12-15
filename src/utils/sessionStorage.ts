import { UserData } from '@/src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@catalogo:user';

export async function saveUser(user: UserData) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function loadUser(): Promise<UserData | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}
