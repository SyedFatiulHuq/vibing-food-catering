import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fromIsoDate,
  isWithinOrderWindow,
  minOrderDate,
  toIsoDate,
} from "../utils/dateUtils";
import { loadPickupDate, savePickupDate } from "../utils/storage";

interface PickupDateContextValue {
  pickupDateIso: string;
  pickupDate: Date;
  setPickupDateIso: (iso: string) => void;
}

const PickupDateContext = createContext<PickupDateContextValue | null>(null);

const initialIso = (): string => {
  const stored = loadPickupDate();
  if (stored) {
    const parsed = fromIsoDate(stored);
    if (isWithinOrderWindow(parsed)) return stored;
  }
  return toIsoDate(minOrderDate());
};

export const PickupDateProvider = ({ children }: { children: ReactNode }) => {
  const [pickupDateIso, setIso] = useState<string>(initialIso);

  useEffect(() => {
    savePickupDate(pickupDateIso);
  }, [pickupDateIso]);

  const setPickupDateIso = useCallback((iso: string) => {
    const parsed = fromIsoDate(iso);
    if (isWithinOrderWindow(parsed)) {
      setIso(iso);
    }
  }, []);

  const value = useMemo<PickupDateContextValue>(
    () => ({
      pickupDateIso,
      pickupDate: fromIsoDate(pickupDateIso),
      setPickupDateIso,
    }),
    [pickupDateIso, setPickupDateIso],
  );

  return <PickupDateContext.Provider value={value}>{children}</PickupDateContext.Provider>;
};

export const usePickupDate = (): PickupDateContextValue => {
  const ctx = useContext(PickupDateContext);
  if (!ctx) throw new Error("usePickupDate must be used within a PickupDateProvider");
  return ctx;
};
