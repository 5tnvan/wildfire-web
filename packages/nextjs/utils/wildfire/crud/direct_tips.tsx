"use server";

import { createClient } from "~~/utils/supabase/server";

export async function insertDirectTip(
  network: any,
  transaction_hash: any,
  amount: any,
  comment: any,
  wallet_id_from: any,
  wallet_id_to: any,
) {
  const supabase = createClient();

  console.log("insertDirectTip", network, transaction_hash, amount, comment, wallet_id_from, wallet_id_to);

  const { error } = await supabase.from("direct_tips").insert({
    network: network,
    transaction_hash: transaction_hash,
    amount: amount,
    comment: comment,
    wallet_id_from: wallet_id_from,
    wallet_id_to: wallet_id_to
  });

  if (error) {
    console.log("insertDirectTip", error);
    return error;
  }
}
