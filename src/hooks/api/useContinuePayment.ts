import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { ExecutePaymentResponse } from "./useExecutePayment";

import { api, ApiError } from "@/clients";

export type ContinuePaymentRequest = {
  orderId: string;
};

export type ContinuePaymentResponse = ExecutePaymentResponse;

const continuePayment = async ({ orderId }: ContinuePaymentRequest) => {
  const response = await api<ContinuePaymentResponse>(
    `/order/${orderId}/payment/continue`,
    {
      method: "POST",
      data: {},
    },
  );

  return response.data;
};

export const useContinuePayment = (
  options: UseMutationOptions<
    ContinuePaymentResponse,
    ApiError,
    ContinuePaymentRequest
  > = {},
) =>
  useMutation({
    mutationFn: continuePayment,
    ...options,
  });
