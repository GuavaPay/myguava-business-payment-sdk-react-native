import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useGuavapayPaymentsContext } from "../Payment";
import { EmailInput } from "../Payment/components/EmailInput";
import { PhoneNumberInput } from "../Payment/components/PhoneNumberInput";
export const PayerInfo = () => {
  const { theme, order, strings, isPayerInfoRequired } = useGuavapayPaymentsContext();
  const [view, setView] = useState<"info" | "form">("info");

  const payerEmail = order?.data?.order?.payer?.maskedContactEmail;
  const payerPhone = order?.data?.order?.payer?.maskedContactPhone?.formatted;

  if (!isPayerInfoRequired && view !== "form") {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: theme.common.gap,
          borderWidth: theme.common.borderWidth,
          borderColor: theme.colors.border,
          borderRadius: theme.common.borderRadius,
          padding: theme.common.padding,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={theme.label}>{strings.contactInfo}</Text>
          <Text style={{ marginTop: theme.common.spacing / 2 }}>
            {payerEmail}
          </Text>
          <Text style={{ marginTop: theme.common.spacing / 2 }}>
            {payerPhone}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={[
              theme.secondaryButton.default.button,
              {
                height: 32,
                padding: 0,
                paddingHorizontal: theme.common.padding,
              },
            ]}
            onPress={() => setView("form")}
          >
            <Text
              style={[
                theme.secondaryButton.default.text,
                { fontSize: theme.common.fontSizeSmall },
              ]}
            >
              {strings.changeInfo}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{ marginBottom: theme.common.spacing, gap: theme.common.spacing }}
    >
      <PhoneNumberInput />
      <EmailInput />
    </View>
  );
};
