import { useCallback, useEffect } from "react";
import { useInterval } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { fetchPriceFromFuseAPI } from "~~/utils/scaffold-eth/fetchPriceFromFuseAPI";

const enablePolling = false;

/**
 * Get the price of Fuse Currency based on the API.
 */
export const useInitializeFuseCurrencyPrice = () => {
  const setFuseCurrencyPrice = useGlobalState(state => state.setFuseCurrencyPrice);
  const setIsFetching = useGlobalState(state => state.setIsFuseCurrencyFetching);

  const fetchPrice = useCallback(async () => {
    setIsFetching(true);
    try {
      const price = await fetchPriceFromFuseAPI();
      setFuseCurrencyPrice(price);
    } finally {
      setIsFetching(false);
    }
  }, [setFuseCurrencyPrice, setIsFetching]);

  // Fetch price on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Optionally fetch price at an interval
  useInterval(fetchPrice, enablePolling ? scaffoldConfig.pollingInterval : null);
};
