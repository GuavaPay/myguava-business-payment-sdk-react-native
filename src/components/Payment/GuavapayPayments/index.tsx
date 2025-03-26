import { View } from "react-native";

import { CardPaymentForm } from "../Card";
import { GuavapayProvider } from "../GuavapayProvider";
import { useGuavapayPaymentsContext, InitProps } from "../context";

import { PlatformPayButton } from "@/components/Payment/PlatformPay";
import { ThreeDSModal } from "@/components/Payment/ThreeDSModal";

const Form = () => {
  const { isPlatformPayEnabled, theme } = useGuavapayPaymentsContext();

  return (
    <View>
      {isPlatformPayEnabled && (
        <View style={{ marginBottom: theme.common.spacing }}>
          <PlatformPayButton />
        </View>
      )}
      <View>
        <CardPaymentForm />
      </View>
      <ThreeDSModal />
    </View>
  );
};

export const GuavapayPayments = (props: InitProps) => {
  return (
    <GuavapayProvider {...props}>
      <Form />
    </GuavapayProvider>
  );
};
