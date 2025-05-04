import AsyncStorage from "@react-native-async-storage/async-storage";

const FLOWER_KEY = "@flowers";
const DOSE_HISTORY_KEY = "@dose_history";

export interface Flower {
  id: string;
  name: string;
  dosage: String;
  times: string[];
  startDate: string;
  duration: string;
  color: string;
  reminder?: boolean;
  currentSupply: number;
  totalSupply: number;
  refillAt: number;
  refillReminder: boolean;
  lastRefillDate?: string;
}

export interface DoseHistory {
  id: string;
  flowerId: string;
  timestamp: string;
  watered: boolean;
}

export async function getFlowers(): Promise<Flower[]> {
  try {
    const data = await AsyncStorage.getItem(FLOWER_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting flowers: ", error);
    return [];
  }
}

export async function addFlower(flower: Flower): Promise<void> {
  try {
    const flowers = await getFlowers();
    flowers.push(flower);
    await AsyncStorage.setItem(FLOWER_KEY, JSON.stringify(flowers));
  } catch (error) {
    throw error;
  }
}

export async function getDoseHistory(): Promise<DoseHistory[]> {
  try {
    const data = await AsyncStorage.getItem(DOSE_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting dose history: ", error);
    return [];
  }
}

export async function getTodaysDoses(): Promise<DoseHistory[]> {
  try {
    const history = await getDoseHistory();
    const today = new Date().toDateString();
    return history.filter(
      (dose) => new Date(dose.timestamp).toDateString() === today
    );
  } catch (error) {
    console.error("Error getting todays doses: ", error);
    return [];
  }
}

export async function recordDose(
  flowerId: string,
  watered: boolean,
  timestamp: string
): Promise<void> {
  try {
    const history = await getDoseHistory();
    const newDose: DoseHistory = {
      id: Math.random().toString(36).substring(2, 9),
      flowerId,
      timestamp,
      watered,
    };
    history.push(newDose);
    await AsyncStorage.setItem(DOSE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error recording dose: ", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([FLOWER_KEY, DOSE_HISTORY_KEY]);
  } catch (error) {
    console.error("Error clearing data: ", error);
    throw error;
  }
}
