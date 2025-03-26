import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { NewCardPaymentForm } from "../NewCard";
import { SavedCardPaymentForm } from "../SavedCard";
import { useGuavapayPaymentsContext } from "../context";

import { PaymentMethod } from "@/types";

export const CardPaymentForm = () => {
  const { isLoading, hasBindings, strings, theme } =
    useGuavapayPaymentsContext();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    hasBindings ? PaymentMethod.SavedPaymentCard : PaymentMethod.PaymentCard,
  );

  const togglePaymentMethod = () => {
    setPaymentMethod((prev) =>
      prev === PaymentMethod.SavedPaymentCard
        ? PaymentMethod.PaymentCard
        : PaymentMethod.SavedPaymentCard,
    );
  };

  return (
    <View>
      {hasBindings && (
        <TouchableOpacity
          onPress={togglePaymentMethod}
          style={[
            theme.secondaryButton.default.button,
            { marginBottom: theme.common.spacing },
          ]}
          disabled={isLoading}
        >
          <Text style={theme.secondaryButton.default.text}>
            {paymentMethod === PaymentMethod.SavedPaymentCard
              ? strings.addNewCard
              : strings.savedCards}
          </Text>
        </TouchableOpacity>
      )}

      {hasBindings && paymentMethod === PaymentMethod.SavedPaymentCard && (
        <SavedCardPaymentForm />
      )}

      {(!hasBindings || paymentMethod === PaymentMethod.PaymentCard) && (
        <NewCardPaymentForm />
      )}
    </View>
  );
};
