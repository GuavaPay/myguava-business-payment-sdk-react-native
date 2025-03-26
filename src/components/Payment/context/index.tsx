import {
  IosPaymentMethodDataDataInterface,
  AndroidPaymentMethodDataDataInterface,
  SupportedNetworkEnum,
} from "@rnw-community/react-native-payments";
import mitt from "mitt";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import WebView from "react-native-webview";

import { ApiError } from "@/clients";
import {
  ContinuePaymentResponse,
  useContinuePayment,
} from "@/hooks/api/useContinuePayment";
import { useExecutePayment } from "@/hooks/api/useExecutePayment";
import { useOrderDetails } from "@/hooks/api/useOrderDetails";
import { usePrecreatePayment } from "@/hooks/api/usePrecreatePayment";
import { Strings, strings } from "@/strings";
import { ThemePartial, Theme, generateTheme } from "@/theme";
import {
  OrderDetailsResponse,
  PaymentMethod,
  SUCCESSFUL_STATUS,
  UNFINAL_STATUS,
  UNSUCCESSFUL_STATUS,
} from "@/types";
import { mergeDeep } from "@/utils";

export type EventFormType = "newCard" | "savedCard";

type Events = {
  resetForm: void;
  submit: EventFormType;
  getState: EventFormType;
  setState: { type: EventFormType; isLoading: boolean; isDisabled: boolean };
  cancel3DS: void;
  start3DS: void;
  finish3DS: void;
};

export const emitter = mitt<Events>();

type PlatformPayOptionalConfig = {
  countryCode?: string;
  currencyCode?: string;
  supportedNetworks?: SupportedNetworkEnum[];
};

type ApplePayConfig = Omit<
  IosPaymentMethodDataDataInterface,
  "countryCode" | "currencyCode" | "supportedNetworks"
> &
  PlatformPayOptionalConfig;

type GooglePayConfig = Omit<
  AndroidPaymentMethodDataDataInterface,
  "countryCode" | "currencyCode" | "supportedNetworks"
> &
  PlatformPayOptionalConfig;

type ErrorType = {
  status?: number;
  message?: string;
  code?: string;
  data?: {
    message?: string;
    code?: string;
  };
};

export type InitProps = {
  orderId: string;
  sessionToken: string;
  onComplete: (order: OrderDetailsResponse) => void;
  onError: (error: {
    error: ErrorType;
    order?: OrderDetailsResponse;
    canRetry?: boolean;
  }) => void;
  applePayConfig?: ApplePayConfig;
  googlePayConfig?: GooglePayConfig;
  theme?: ThemePartial;
  strings?: Partial<Strings>;
  env?: "preprod" | "prod";
};

type ContextProps = Omit<InitProps, "theme" | "strings"> & {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  paymentDisabled: boolean;
  setPaymentDisabled: React.Dispatch<React.SetStateAction<boolean>>;

  isPlatformPayEnabled: boolean;

  precreate: ReturnType<typeof usePrecreatePayment>;
  execute: ReturnType<typeof useExecutePayment>;
  order: ReturnType<typeof useOrderDetails>;
  continuePayment: ReturnType<typeof useContinuePayment>;

  onCancel3DS: () => void;

  hasBindings: boolean;
  theme: Theme;
  strings: typeof strings;

  isPayerInfoRequired: boolean;
  is3DSRequired: boolean;
};

const GuavaPaymentsContext = createContext<ContextProps | null>(null);

const getOrderStatus = (orderDetails?: OrderDetailsResponse | null) => {
  const status = orderDetails?.order?.status;

  if (!status) return "error";
  if (UNFINAL_STATUS.includes(status)) return "waiting";
  if (SUCCESSFUL_STATUS.includes(status)) return "success";
  if (UNSUCCESSFUL_STATUS.includes(status)) return "unsuccess";
  return "error";
};

const transformApiError = (error: ApiError) => {
  return {
    status: error?.status,
    message: error?.message,
    code: error?.code,
    data: error?.response?.data as {
      message?: string;
      code?: string;
    },
  };
};

export const GuavapayPaymentsProvider = ({
  children,
  theme: themeProp,
  strings: stringsProp,
  ...props
}: PropsWithChildren<InitProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDisabled, setPaymentDisabled] = useState(false);
  const webViewRef = useRef(null);

  const order = useOrderDetails({
    queryKey: ["orderDetails", props.orderId],
  });
  const precreate = usePrecreatePayment();
  const execute = useExecutePayment();
  const continuePayment = useContinuePayment();

  const error = precreate.error || execute.error || continuePayment.error;

  const reset = ({ resetForm } = { resetForm: true }) => {
    if (resetForm) {
      emitter.emit("resetForm");
    }

    setIsLoading(false);
    precreate.reset();
    execute.reset();
    continuePayment.reset();
  };

  useEffect(() => {
    if (order.isError) {
      reset();
      props.onError({ error: transformApiError(order.error), canRetry: false });
    } else if (order.isSuccess) {
      const orderStatus = getOrderStatus(order.data);
      if (orderStatus !== "waiting") {
        reset();
        props.onComplete(order.data);
      }
    }
  }, [order.data, order.isSuccess, order.isError]);

  useEffect(() => {
    if (error) {
      const errorStatus = error.status || 0;
      if (errorStatus >= 400 && errorStatus < 500) {
        props.onError({
          error: transformApiError(error),
          order: order.data,
          canRetry: false,
        });
      } else {
        reset({ resetForm: false });
        props.onError({
          error: transformApiError(error),
          order: order.data,
          canRetry: true,
        });
        setIsLoading(false);
      }
    }
  }, [error]);

  const onCancel3DS = () => {
    reset();
    props.onError({
      error: { message: "Cancelled by user" },
      order: order.data,
      canRetry: false,
    });
  };

  useEffect(() => {
    emitter.on("cancel3DS", onCancel3DS);

    return () => {
      emitter.off("cancel3DS", onCancel3DS);
    };
  }, []);

  const threedsChallenge =
    execute.data?.requirements?.threedsChallenge ||
    continuePayment.data?.requirements?.threedsChallenge;

  useEffect(() => {
    if (threedsChallenge) {
      emitter.emit("start3DS");
    }
  }, [threedsChallenge]);

  const orderDetails = order.data;

  const availablePaymentMethods = orderDetails?.order?.availablePaymentMethods;
  const includesBindings = availablePaymentMethods?.includes(
    PaymentMethod.SavedPaymentCard,
  );
  const hasBindings =
    (orderDetails?.order?.payerId && includesBindings) || false;

  const payerEmail = orderDetails?.order?.payer?.maskedContactEmail;
  const payerPhone = orderDetails?.order?.payer?.maskedContactPhone?.formatted;

  const context = {
    ...props,
    isPlatformPayEnabled:
      (Platform.OS === "ios" && !!props.applePayConfig) ||
      (Platform.OS === "android" && !!props.googlePayConfig),
    isLoading,
    setIsLoading,
    precreate,
    execute,
    order,
    continuePayment,
    onCancel3DS,
    hasBindings,
    theme: generateTheme(themeProp),
    strings: mergeDeep(strings, stringsProp || {}) as typeof strings,
    paymentDisabled,
    setPaymentDisabled,
    isPayerInfoRequired: !(payerEmail || payerPhone),
    is3DSRequired: !!threedsChallenge,
  };

  const continuePaymentFormData =
    continuePayment?.data?.requirements?.threedsMethod ||
    execute?.data?.requirements?.threedsMethod ||
    precreate?.data?.requirements?.threedsMethod;

  const handleContinue = async () => {
    if (precreate.data && !(continuePayment.data || execute.data)) return;
    (await continuePayment.mutateAsync({
      orderId: props.orderId,
    })) as ContinuePaymentResponse | null;
  };

  if (order.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GuavaPaymentsContext.Provider value={context}>
      {children}
      {continuePaymentFormData && (
        <View style={{ height: 0, width: 0 }}>
          <WebView
            style={{ height: 0, width: 0, overflow: "hidden" }}
            ref={webViewRef}
            originWhitelist={["*"]}
            onMessage={(event) => {
              if (event.nativeEvent.data === "continue") {
                handleContinue();
              }
            }}
            source={{
              html: `
                <form id="three_ds_method_form" action='${continuePaymentFormData.url}' method='post'>
                    <input type='hidden' name='threeDSMethodData' value='${continuePaymentFormData.data}'/>
                </form>

                <script>
                    document.getElementById("three_ds_method_form").submit();
                    window.ReactNativeWebView.postMessage("continue");
                </script>
          `,
            }}
          />
        </View>
      )}
    </GuavaPaymentsContext.Provider>
  );
};

type UseGuavapayPaymentsContextProps = {
  onResetForm?: () => void;
};

export const useGuavapayPaymentsContext = (
  props?: UseGuavapayPaymentsContextProps,
) => {
  const { onResetForm } = props || {};

  useEffect(() => {
    if (onResetForm) {
      emitter.on("resetForm", onResetForm);
    }

    return () => {
      if (onResetForm) {
        emitter.off("resetForm", onResetForm);
      }
    };
  }, [onResetForm]);

  const context = useContext(GuavaPaymentsContext);
  if (!context) {
    throw new Error(
      "useGuavapayPaymentsContext must be used within a GuavapayPaymentsProvider",
    );
  }
  return context;
};
