import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { api, ApiError } from "@/clients";
import { OrderDetailsResponse } from "@/types";
import { getQueryParams } from "@/utils";

export type OrderDetailsRequest = {
  id: string;
  withMerchant?: boolean;
  withTransactions?: boolean;
  withRequirements?: boolean;
};

export const getOrderDetails = async ({
  id,
  withMerchant,
  withRequirements,
  withTransactions,
}: OrderDetailsRequest) => {
  const query = getQueryParams(
    withTransactions && "transactions-included=true",
    withMerchant && "merchant-included=true",
    withRequirements && "payment-requirements-included=true",
  );

  const response = await api<OrderDetailsResponse>(`/order/${id}${query}`);
  const order = response.data;
  if (!order?.order) {
    throw new Error("Order fetch error.");
  }
  return order;
};

export const useOrderDetails = (
  options?: UseQueryOptions<
    OrderDetailsResponse,
    ApiError,
    OrderDetailsResponse,
    [string, string]
  >,
) => {
  return useQuery({
    queryKey: options?.queryKey as [string, string],
    queryFn: ({ queryKey: [, orderId] }) =>
      getOrderDetails({
        id: orderId,
        withMerchant: true,
        withRequirements: true,
        withTransactions: true,
      }),
    refetchInterval: 3000,
    ...options,
  });
};
