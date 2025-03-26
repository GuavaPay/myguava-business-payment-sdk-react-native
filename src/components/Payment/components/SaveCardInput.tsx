import { useFormContext } from "react-hook-form";
import { TouchableWithoutFeedback, View, Text } from "react-native";

import { TextInputField } from "./TextInputField";
import { useGuavapayPaymentsContext } from "../../Payment/context";
import { CheckIcon } from "../../icons";

export const BindingNameField = ({
  name = "bindingName",
}: {
  name?: string;
}) => {
  const { strings, isLoading } = useGuavapayPaymentsContext();

  return (
    <TextInputField
      editable={!isLoading}
      label={strings.cardName.label}
      name={name}
      rules={{
        required: strings.cardName.required,
        maxLength: {
          value: 200,
          message: strings.cardName.invalid,
        },
        pattern: {
          value: /^[a-zA-Z0-9\s]+$/,
          message: strings.cardName.invalid,
        },
      }}
      defaultValue=""
      placeholder={strings.cardName.placeholder}
    />
  );
};

export const SaveCardInput = () => {
  const { theme, strings } = useGuavapayPaymentsContext();
  const { watch, setValue } = useFormContext();

  const bindingCreationIsNeeded = watch("bindingCreationIsNeeded");

  return (
    <View
      style={{
        flexDirection: "column",
        gap: theme.common.gap,
        marginBottom: !bindingCreationIsNeeded
          ? theme.common.gap - theme.common.spacing
          : 0,
      }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          setValue("bindingCreationIsNeeded", !bindingCreationIsNeeded)
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.common.spacing,
          }}
        >
          <View
            style={[
              theme.checkbox.default,
              bindingCreationIsNeeded && theme.checkbox.checked,
            ]}
          >
            {bindingCreationIsNeeded && <CheckIcon />}
          </View>
          <Text style={[theme.label, { marginBottom: 0 }]}>
            {[strings.saveCard]}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {bindingCreationIsNeeded && <BindingNameField />}
    </View>
  );
};
