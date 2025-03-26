import { OrderDetailsResponse } from "../types";

import { api } from "@/clients";

export const createOrder = async (
  apiKey: string,
  data: Record<string, unknown>,
) => {
  if (!data.referenceNumber) {
    const date = new Date();
    data.referenceNumber =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      date.getDate() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds() +
      date.getMilliseconds();
  }

  const response = await api<OrderDetailsResponse>("/order", {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return response.data;
};
