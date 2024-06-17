"use server";

import { createClient } from "~~/utils/supabase/server";

/**
 * FETCH: fetchCountries()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchCountries = async () => {
  console.log("im hererere fetchCountries");
  const supabase = createClient();
  const { data, error } = await supabase.from("countries").select();

  if (error) console.log("error");

  return data;
};
