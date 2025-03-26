import { forwardRef, useEffect, useState } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { View, Text, TextInput } from "react-native";
import MaskInput, { Mask } from "react-native-mask-input";

import { useGuavapayPaymentsContext } from "../../Payment/context";

type Props = React.ComponentProps<typeof TextInput> & {
  label?: string;
  name: string;
  rules: RegisterOptions;
  onValid?: () => void;
  error?: string;
  showError?: boolean;
  mask?: Mask;
  icon?: React.ComponentType | null;
  format?: (value: string, currentValue?: string) => string;
};

export const TextInputField = forwardRef<TextInput, Props>(
  (
    {
      label,
      name,
      rules,
      onValid,
      defaultValue,
      icon: Icon,
      error,
      format,
      style,
      showError,
      ...props
    },
    ref,
  ) => {
    const { theme } = useGuavapayPaymentsContext();
    const [isFocused, setIsFocused] = useState(false);
    const { control, formState, trigger, watch } = useFormContext();

    const { errors, touchedFields } = formState;

    const value = watch(name);

    useEffect(() => {
      async function validate() {
        const isValid = await trigger(name);
        if (isValid) onValid?.();
      }

      validate();
    }, [value, name, trigger]); // eslint-disable-line react-hooks/exhaustive-deps

    const errorText =
      !isFocused && touchedFields[name]
        ? (errors[name]?.message as string) || error
        : "";

    return (
      <View style={{ flex: 1 }}>
        {label && <Text style={theme.label}>{label}</Text>}
        <View style={{ position: "relative", flex: 1 }}>
          {Icon && (
            <View style={theme.input.iconContainer}>
              <View style={theme.input.icon}>
                <Icon />
              </View>
            </View>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskInput
                style={[
                  theme.input.default,
                  style,
                  isFocused && theme.input.focused,
                  errorText && theme.input.invalid,
                ]}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={(newValue) => {
                  if (format) {
                    onChange(format(newValue, value));
                  } else {
                    onChange(newValue);
                  }
                }}
                value={value}
                ref={ref}
                placeholderTextColor={theme.colors.placeholder}
                {...props}
              />
            )}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
          />
        </View>
        {errorText && (showError === undefined || showError === true) && (
          <Text style={theme.input.errorText}>{errorText}</Text>
        )}
      </View>
    );
  },
);
