import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  fuseCurrency: {
    price: number;
    isFetching: boolean;
  };
  setNativeCurrencyPrice: (newPrice: number) => void;
  setIsNativeCurrencyFetching: (isFetching: boolean) => void;
  setFuseCurrencyPrice: (newPrice: number) => void;
  setIsFuseCurrencyFetching: (isFetching: boolean) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  fuseCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newPrice: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newPrice } })),
  setIsNativeCurrencyFetching: (isFetching: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching } })),
  setFuseCurrencyPrice: (newPrice: number): void =>
    set(state => ({ fuseCurrency: { ...state.fuseCurrency, price: newPrice } })),
  setIsFuseCurrencyFetching: (isFetching: boolean): void =>
    set(state => ({ fuseCurrency: { ...state.fuseCurrency, isFetching } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes): void => set(() => ({ targetNetwork: newTargetNetwork })),
}));
