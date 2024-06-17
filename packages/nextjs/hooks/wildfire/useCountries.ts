"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "~~/utils/wildfire/fetch/fetchCountries";

/**
 * useCountries HOOK
 * Use this to get all countries
 **/
export const useCountries = () => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setLoading(true);
    console.log("im hererere useCountries");
    const res = await fetchCountries();
    if (res) setCountries(res);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { loading, countries, refetch };
};