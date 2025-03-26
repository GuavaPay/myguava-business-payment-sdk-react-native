import {
  AndroidPaymentMethodToken,
  IosPKToken,
} from "@rnw-community/react-native-payments";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { api, ApiError } from "@/clients";
import { Currency, Payer, PaymentMethod, ThreeDSChallenge } from "@/types";
import { getDeviceData } from "@/utils";

export type PaymentExchangeVariables = {
  amount: {
    baseUnits: number;
    currency: Currency["id"];
  };
  token: string;
};

export type PaymentRequestVariables = {
  deviceData?: {
    browserData: {
      acceptHeader?: string;
      userAgent?: string;
      javaScriptEnabled?: boolean;
      javaEnabled?: boolean;
      language?: string;
      screenHeight: number;
      screenWidth: number;
      timeZoneOffset: number;
      screenColorDepth: number;
    };
    ip?: string;
  };
  exchange?: PaymentExchangeVariables;
};

export type CardPaymentRequest = {
  type: PaymentMethod.PaymentCard;
  pan: string;
  cvv2?: string;
  expiryDate?: string;
  cardholderName?: string;
};

export type BindingPaymentRequest = {
  type: PaymentMethod.SavedPaymentCard;
  bindingId: string;
  cvv2?: string;
};

export type ApplePayPaymentRequest = {
  type: PaymentMethod.ApplePay;
  payment: IosPKToken;
};

export type GooglePayPaymentRequest = {
  type: PaymentMethod.GooglePay;
  paymentData: AndroidPaymentMethodToken;
};

export type PrecreatePaymentRequest = PaymentRequestVariables & {
  paymentMethod:
  | CardPaymentRequest
  | BindingPaymentRequest
  | ApplePayPaymentRequest
  | GooglePayPaymentRequest;
  payer?: Payer;
};

export type PrecreatePaymentResponse = {
  requirements: {
    threedsMethod?: ThreeDSChallenge;
  };
};

const precreatePayment = async ({
  orderId,
  ...req
}: PrecreatePaymentRequest & { orderId: string }) => {
  const response = await api<PrecreatePaymentResponse>(
    `/order/${orderId}/payment`,
    {
      method: "PUT",
      data: {
        ...req,
        ...getDeviceData(),
      },
    },
  );

  return response.data;
};

export const usePrecreatePayment = (
  options?: UseMutationOptions<
    PrecreatePaymentResponse,
    ApiError,
    PrecreatePaymentRequest & { orderId: string }
  >,
) => {
  return useMutation({
    mutationFn: precreatePayment,
    ...options,
  });
};
