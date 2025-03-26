import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { NewCard } from "./NewCard";
import { useGuavapayPaymentsContext, emitter } from "../context";

import { PayerInfo } from "@/components/PayerInfo";
import { ChallengeWindowSize } from "@/hooks/api/useExecutePayment";
import { useResolveCard } from "@/hooks/api/useResolveCard";
import { PaymentMethod } from "@/types";
import { getPayerInfo } from "@/utils";

const defaultValues = {
  pan: "",
  expiryDate: "",
  cvv2: "",
  cardholderName: "",
  bindingName: "",
  bindingCreationIsNeeded: false,
  contactEmail: "",
  contactPhone: "",
};

type NewCardPaymentFormFields = {
  pan: string;
  expiryDate: string;
  cvv2: string;
  cardholderName: string;
  bindingCreationIsNeeded?: boolean;
  bindingName?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export const NewCardPaymentForm = ({
  withButton = true,
}: {
  withButton?: boolean;
}) => {
  const formMethods = useForm({ mode: "onBlur", defaultValues });
  const {
    handleSubmit,
    watch,
    formState: { isValid },
    reset,
    getValues,
  } = formMethods;

  const {
    orderId,
    precreate,
    execute,
    order,
    isLoading,
    setIsLoading,
    strings,
    theme,
    paymentDisabled,
  } = useGuavapayPaymentsContext({
    onResetForm: reset,
  });

  const pan = watch("pan")?.replaceAll(/\s/g, "");
  const {
    data: resolveCardResponse,
    isLoading: isCardResolving,
    isError: isCardResolveError,
  } = useResolveCard({
    queryKey: ["resolveCard", pan?.slice(0, 6)],
    enabled: pan?.length > 5,
  });

  const onSubmit = async ({
    pan,
    expiryDate,
    cvv2,
    cardholderName,
    bindingCreationIsNeeded,
    bindingName,
    contactEmail,
    contactPhone,
  }: NewCardPaymentFormFields) => {
    const payer = getPayerInfo({
      contactEmail,
      contactPhone,
    });

    pan = pan?.replaceAll(/\s/g, "");
    setIsLoading(true);

    await precreate.mutateAsync({
      orderId,
      paymentMethod: {
        type: PaymentMethod.PaymentCard,
        pan,
      },
      payer,
    });

    await execute.mutateAsync({
      orderId,
      paymentMethod: {
        type: PaymentMethod.PaymentCard,
        pan,
        cardholderName,
        expiryDate: expiryDate.split("/").reverse().join(""),
        cvv2,
      },
      bindingCreationIsNeeded: !!bindingCreationIsNeeded,
      bindingName: bindingName || undefined,
      challengeWindowSize: ChallengeWindowSize["01"],
      payer,
    });
  };

  const isDisabled =
    paymentDisabled ||
    isLoading ||
    !isValid ||
    isCardResolving ||
    isCardResolveError;

  const onSubmitEvent = (e: string) => {
    if (e === "newCard" && !isDisabled) {
      onSubmit(getValues());
    }
  };

  const onGetStateEvent = (e: string) => {
    if (e === "newCard") {
      emitter.emit("setState", {
        type: "newCard",
        isLoading,
        isDisabled,
      });
    }
  };

  useEffect(() => {
    emitter.emit("setState", {
      type: "newCard",
      isLoading,
      isDisabled,
    });

    emitter.on("submit", onSubmitEvent);
    emitter.on("getState", onGetStateEvent);

    return () => {
      emitter.off("submit", onSubmitEvent);
      emitter.off("getState", onGetStateEvent);
    };
  }, [isDisabled, isLoading]);

  return (
    <FormProvider {...formMethods}>
      <PayerInfo />
      <NewCard
        resolveCardResponse={resolveCardResponse}
        isCardResolving={isCardResolving}
        isCardResolveError={isCardResolveError}
      />

      {withButton && (
        <TouchableOpacity
          style={[
            theme.payButton.default.button,
            isDisabled && theme.payButton.disabled.button,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isDisabled}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={theme.payButton.default.text}>
              {strings.pay} {order.data?.order?.totalAmount?.localized}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </FormProvider>
  );
};
