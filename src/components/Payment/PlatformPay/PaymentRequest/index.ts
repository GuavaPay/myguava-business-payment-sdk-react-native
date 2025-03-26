import {
  PaymentRequest,
  PaymentMethodData,
  PaymentDetailsInit,
  AndroidPaymentResponse,
  IosPaymentResponse,
  PaymentMethodNameEnum,
  PaymentResponse,
  AndroidPaymentMethodToken,
} from "@rnw-community/react-native-payments";
import { AndroidPaymentData } from "@rnw-community/react-native-payments/src/@standard/android/response/android-payment-data";
import { PaymentsError } from "@rnw-community/react-native-payments/src/error/payments.error";
import { Platform } from "react-native";

class FullAndroidPaymentResponse extends PaymentResponse {
  constructor(requestId: string, methodName: string, jsonData: string) {
    const data = JSON.parse(jsonData) as AndroidPaymentData;
    const androidPaymentResponse = new AndroidPaymentResponse(
      requestId,
      methodName,
      jsonData,
    );
    super(requestId, methodName, {
      ...androidPaymentResponse.details,
      androidPayToken: data as unknown as AndroidPaymentMethodToken,
    });
  }
}

export class GuavapayPaymentRequest extends PaymentRequest {
  constructor(
    methodData: PaymentMethodData[],
    paymentDetails: PaymentDetailsInit,
  ) {
    super(methodData, paymentDetails);

    (this as any).handleAccept = function (
      details: string,
    ): AndroidPaymentResponse | IosPaymentResponse {
      try {
        return Platform.OS === "android"
          ? new FullAndroidPaymentResponse(
            this.id,
            PaymentMethodNameEnum.AndroidPay,
            details,
          )
          : new IosPaymentResponse(
            this.id,
            PaymentMethodNameEnum.ApplePay,
            details,
          );
      } catch (_e) {
        throw new PaymentsError(`Failed parsing PaymentRequest details`);
      }
    };
  }
}
