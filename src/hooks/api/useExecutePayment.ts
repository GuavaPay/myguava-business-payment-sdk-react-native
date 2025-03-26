import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import {
  ApplePayPaymentRequest,
  BindingPaymentRequest,
  CardPaymentRequest,
  GooglePayPaymentRequest,
  PaymentRequestVariables,
} from "./usePrecreatePayment";

import { api, ApiError } from "@/clients";
import { Payer, PaymentRequirements } from "@/types";
import { getDeviceData } from "@/utils";

export enum ChallengeWindowSize {
  "01" = "SIZE_250_X_400", // Small size
  "02" = "SIZE_390_X_400", // Compact size
  "03" = "SIZE_500_X_600", // Medium size
  "04" = "SIZE_600_X_400", // Default size
  "05" = "FULL_SCREEN", // Fullscreen
}

export type ExecutePaymentRequest = PaymentRequestVariables & {
  paymentMethod:
  | CardPaymentRequest
  | BindingPaymentRequest
  | ApplePayPaymentRequest
  | GooglePayPaymentRequest;
  bindingCreationIsNeeded?: boolean;
  bindingName?: string;
  payer?: Payer;
  challengeWindowSize?: ChallengeWindowSize;
  priorityRedirectUrl?: string;
} & { orderId: string };

export type ExecutePaymentResponse = {
  requirements: PaymentRequirements;
  redirectUrl?: string;
};

const executePayment = async <T extends ExecutePaymentRequest>({
  orderId,
  ...req
}: T) => {
  const response = await api<ExecutePaymentResponse>(
    `/order/${orderId}/payment/execute`,
    {
      method: "POST",
      data: {
        ...req,
        ...getDeviceData(),
      },
    },
  );

  return response.data;
};

export const useExecutePayment = <T extends ExecutePaymentRequest>(
  options?: UseMutationOptions<ExecutePaymentResponse, ApiError, T>,
) => {
  return useMutation({
    mutationFn: (req: T) => executePayment(req),
    ...options,
  });
};
