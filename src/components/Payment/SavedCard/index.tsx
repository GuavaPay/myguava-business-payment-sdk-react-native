import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { SavedCards } from "./SavedCards";
import { emitter, useGuavapayPaymentsContext } from "../context";

import { PayerInfo } from "@/components/PayerInfo";
import { Binding } from "@/hooks/api/useBindigs";
import { PaymentMethod } from "@/types";
import { getPayerInfo } from "@/utils";

const defaultValues = {
  bindingCvv2: "",
  contactEmail: "",
  contactPhone: "",
};

type SavedCardPaymentFormFields = {
  bindingCvv2?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export const SavedCardPaymentForm = ({
  withButton = true,
}: {
  withButton?: boolean;
}) => {
  const [selectedBinding, setSelectedBinding] = useState<Binding>();
  const formMethods = useForm({ mode: "onBlur", defaultValues });
  const {
    getValues,
    handleSubmit,
    formState: { isValid },
    reset,
  } = formMethods;

  const {
    orderId,
    precreate,
    execute,
    order,
    isLoading,
    setIsLoading,
    hasBindings,
    strings,
    theme,
    paymentDisabled,
  } = useGuavapayPaymentsContext({
    onResetForm: reset,
  });

  const onSubmit = async ({
    bindingCvv2,
    contactEmail,
    contactPhone,
  }: SavedCardPaymentFormFields) => {
    const payer = getPayerInfo({
      contactEmail,
      contactPhone,
    });

    setIsLoading(true);

    await precreate.mutateAsync({
      orderId,
      paymentMethod: {
        type: PaymentMethod.SavedPaymentCard,
        bindingId: selectedBinding!.id,
      },
      payer,
    });

    await execute.mutateAsync({
      orderId,
      paymentMethod: {
        type: PaymentMethod.SavedPaymentCard,
        bindingId: selectedBinding!.id,
        cvv2: bindingCvv2,
      },
      payer,
    });
  };

  const isDisabled =
    paymentDisabled || isLoading || !isValid || !selectedBinding;

  const onSubmitEvent = (e: string) => {
    if (e === "savedCard" && !isDisabled) {
      onSubmit(getValues());
    }
  };

  const onGetStateEvent = (e: string) => {
    if (e === "savedCard") {
      emitter.emit("setState", {
        type: "savedCard",
        isLoading,
        isDisabled,
      });
    }
  };

  useEffect(() => {
    emitter.emit("setState", {
      type: "savedCard",
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

  if (!hasBindings) {
    return null;
  }

  return (
    <FormProvider {...formMethods}>
      <PayerInfo />
      <SavedCards
        selectedBinding={selectedBinding}
        onBindingSelect={setSelectedBinding}
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
