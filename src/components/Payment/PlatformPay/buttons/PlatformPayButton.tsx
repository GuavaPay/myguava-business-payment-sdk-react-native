import {
  AndroidPaymentMethodDataDataInterface,
  PaymentComplete,
  PaymentResponse,
} from "@rnw-community/react-native-payments";
import {
  PaymentMethodNameEnum,
  SupportedNetworkEnum,
  PaymentMethodData,
} from "@rnw-community/react-native-payments/src";
import { useEffect, useRef, useState } from "react";
import { View, Platform } from "react-native";

import { ApplePayButton, ApplePayButtonProps } from "./ApplePayButton";
import { GooglePayButton, GooglePayButtonProps } from "./GooglePayButton";
import { GuavapayPaymentRequest } from "../PaymentRequest";

import { useGuavapayPaymentsContext } from "@/components/Payment/context";
import {
  ApplePayPaymentRequest,
  GooglePayPaymentRequest,
} from "@/hooks/api/usePrecreatePayment";
import { PaymentMethod, UNFINAL_STATUS } from "@/types";

type PlatformPayButtonProps = {
  applePayButtonProps?: Omit<ApplePayButtonProps, "onPress">;
  googlePayButtonProps?: Omit<GooglePayButtonProps, "onPress">;
};

export const PlatformPay = ({
  applePayButtonProps,
  googlePayButtonProps,
}: PlatformPayButtonProps) => {
  const {
    onComplete,
    order,
    applePayConfig,
    googlePayConfig,
    execute,
    isLoading,
    setIsLoading,
    theme,
    isPlatformPayEnabled,
  } = useGuavapayPaymentsContext();
  const [isPaymentPossible, setIsPaymentPossible] = useState(false);
  const paymentResponse = useRef<PaymentResponse | null>(null);

  const platformPayConfig =
    Platform.OS === "ios" ? applePayConfig : googlePayConfig;

  const countryCode =
    order?.data?.merchant?.country?.alpha2Code ||
    platformPayConfig?.countryCode ||
    "GB";
  const currencyCode =
    order?.data?.order?.availablePaymentCurrencies?.[0] ||
    platformPayConfig?.currencyCode ||
    "GBP";
  const supportedNetworks = [
    SupportedNetworkEnum.Visa,
    SupportedNetworkEnum.Mastercard,
    SupportedNetworkEnum.Amex,
  ];

  const methodData: PaymentMethodData[] = [];

  if (applePayConfig) {
    methodData.push({
      supportedMethods: PaymentMethodNameEnum.ApplePay,
      data: {
        supportedNetworks,
        countryCode,
        currencyCode,
        ...applePayConfig,
      },
    });
  }

  if (googlePayConfig) {
    methodData.push({
      supportedMethods: PaymentMethodNameEnum.AndroidPay,
      data: {
        supportedNetworks,
        countryCode,
        currencyCode,
        ...googlePayConfig,
        requestPayerEmail: true,
      } as AndroidPaymentMethodDataDataInterface,
    });
  }

  const paymentDetails = {
    total: {
      amount: {
        currency: currencyCode,
        value: order?.data?.order?.totalAmount?.baseUnits?.toString() || "0.00",
      },
      label: "Total",
    },
  };

  const paymentRequest = new GuavapayPaymentRequest(methodData, paymentDetails);

  const canMakePayment = async () => {
    const isPaymentPossible = await paymentRequest.canMakePayment();
    if (isPaymentPossible) {
      setIsPaymentPossible(true);
    } else {
      setIsPaymentPossible(false);
    }
  };

  useEffect(() => {
    canMakePayment();
  }, []);

  useEffect(() => {
    if (execute.isError) {
      paymentResponse.current?.complete(PaymentComplete.FAIL);
      paymentResponse.current = null;
    }
  }, [execute.isError]);

  const onPay = async () => {
    setIsLoading(true);
    try {
      paymentResponse.current = await paymentRequest.show();
      const {
        details: { applePayToken, androidPayToken },
      } = paymentResponse.current;

      let paymentMethod:
        | ApplePayPaymentRequest
        | GooglePayPaymentRequest
        | null = null;

      if (Platform.OS === "ios") {
        paymentMethod = {
          type: PaymentMethod.ApplePay,
          payment: {
            token: applePayToken,
          },
        } as unknown as ApplePayPaymentRequest;
      } else {
        paymentMethod = {
          type: PaymentMethod.GooglePay,
          paymentData: androidPayToken,
        } as unknown as GooglePayPaymentRequest;
      }

      await execute.mutateAsync({
        orderId: order.data!.order.id,
        paymentMethod,
      });

      setTimeout(() => {
        paymentResponse.current?.complete(PaymentComplete.SUCCESS);
        paymentResponse.current = null;
        if (!UNFINAL_STATUS.includes(order.data!.order.status)) {
          onComplete(order.data!);
        }
      }, 100);
    } catch {
      setIsLoading(false);
    }
  };

  if (!isPaymentPossible || !isPlatformPayEnabled) {
    return null;
  }

  return (
    <View>
      {applePayConfig && (
        <ApplePayButton
          {...applePayButtonProps}
          disabled={isLoading}
          onPress={onPay}
          {...theme.applePayButton}
        />
      )}
      {googlePayConfig && (
        <GooglePayButton
          {...googlePayButtonProps}
          disabled={isLoading}
          onPress={onPay}
          {...theme.googlePayButton}
        />
      )}
    </View>
  );
};

export const PlatformPayButton = ({
  applePayButtonProps,
  googlePayButtonProps,
}: PlatformPayButtonProps) => {
  const { order, isPlatformPayEnabled } = useGuavapayPaymentsContext();

  if (!isPlatformPayEnabled || !order?.data?.order) {
    return null;
  }

  return (
    <PlatformPay
      applePayButtonProps={applePayButtonProps}
      googlePayButtonProps={googlePayButtonProps}
    />
  );
};
