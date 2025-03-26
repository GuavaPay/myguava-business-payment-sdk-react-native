import cardValidator from "card-validator";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { View, TextInput, ViewStyle } from "react-native";
import { Masks } from "react-native-mask-input";

import { CardCvvIcon, PaymentIcons } from "../../icons";
import { SaveCardInput } from "../components/SaveCardInput";
import { TextInputField } from "../components/TextInputField";
import { useGuavapayPaymentsContext } from "../context";

import { ResolveCardResponse } from "@/hooks/api/useResolveCard";

const CARD_HOLDER_REGEX = /^([a-zA-Z]+) ?([a-zA-Z]*)$/;
const CARD_HOLDER_MAX_LENGTH = 25;
const CARD_HOLDER_MIN_LENGTH = 2;

type NewCardProps = {
  resolveCardResponse?: ResolveCardResponse;
  isCardResolving: boolean;
  isCardResolveError: boolean;
};

export const NewCard = ({
  resolveCardResponse,
  isCardResolving,
  isCardResolveError,
}: NewCardProps) => {
  const { theme, strings, isLoading } = useGuavapayPaymentsContext();
  const { watch } = useFormContext();
  const panRef = useRef<TextInput>(null);
  const expiryDateRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const cardHolderNameRef = useRef<TextInput>(null);

  const pan = watch("pan")?.replaceAll(/\s/g, "");
  const { card } = cardValidator.number(pan);
  const cvvLength = card?.code?.size || 3;
  const containerStyle: ViewStyle = {
    flexDirection: "column",
    gap: theme.common.gap,
  };

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    gap: theme.common.spacing,
  };

  const Icon = resolveCardResponse?.cardScheme
    ? PaymentIcons[resolveCardResponse.cardScheme as keyof typeof PaymentIcons]
    : null;

  return (
    <View style={containerStyle}>
      <TextInputField
        editable={!isLoading}
        label={strings.cardNumber.label}
        name="pan"
        error={
          !isCardResolving &&
            (isCardResolveError ||
              (resolveCardResponse && !resolveCardResponse.cardScheme))
            ? strings.cardNumber.invalid
            : ""
        }
        rules={{
          required: strings.cardNumber.required,
          validate: {
            isValid: (value: string) => {
              return (
                cardValidator.number(value).isValid ||
                strings.cardNumber.invalid
              );
            },
          },
        }}
        keyboardType="number-pad"
        placeholder={strings.cardNumber.placeholder}
        mask={Masks.CREDIT_CARD}
        defaultValue=""
        icon={Icon}
        ref={panRef}
        onValid={() => {
          expiryDateRef?.current?.focus();
        }}
        maxLength={19}
      />

      <View style={rowStyle}>
        <View style={{ flex: 1 }}>
          <TextInputField
            editable={!isLoading}
            label={strings.expiryDate.label}
            name="expiryDate"
            keyboardType="number-pad"
            rules={{
              required: strings.expiryDate.required,
              validate: {
                isValid: (value: string) => {
                  return (
                    cardValidator.expirationDate(value).isValid ||
                    strings.expiryDate.invalid
                  );
                },
              },
            }}
            placeholder={strings.expiryDate.placeholder}
            mask={[/\d/, /\d/, "/", /\d/, /\d/]}
            ref={expiryDateRef}
            defaultValue=""
            onValid={() => {
              cvvRef?.current?.focus();
            }}
            maxLength={5}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TextInputField
            editable={!isLoading}
            label={strings.cvv2.label}
            name="cvv2"
            rules={{
              required: strings.cvv2.required,
              validate: {
                isValid: (value: string) => {
                  return (
                    cardValidator.cvv(value, cvvLength).isValid ||
                    strings.cvv2.invalid
                  );
                },
              },
            }}
            keyboardType="number-pad"
            placeholder={strings.cvv2.placeholder}
            mask={[/\d/, /\d/, /\d/]}
            ref={cvvRef}
            defaultValue=""
            onValid={() => {
              cardHolderNameRef?.current?.focus();
            }}
            maxLength={cvvLength}
            icon={CardCvvIcon}
          />
        </View>
      </View>

      <TextInputField
        editable={!isLoading}
        label={strings.cardholderName.label}
        name="cardholderName"
        rules={{
          minLength: {
            value: CARD_HOLDER_MIN_LENGTH,
            message: strings.cardholderName.invalid,
          },
          maxLength: {
            value: CARD_HOLDER_MAX_LENGTH,
            message: strings.cardholderName.invalid,
          },
          pattern: {
            value: CARD_HOLDER_REGEX,
            message: strings.cardNumber.invalid,
          },
          required: strings.cardholderName.required,
          validate: {
            isValid: (value: string) => {
              return (
                cardValidator.cardholderName(value).isValid ||
                strings.cardholderName.invalid
              );
            },
          },
        }}
        defaultValue=""
        placeholder={strings.cardholderName.placeholder}
        ref={cardHolderNameRef}
        autoCapitalize="characters"
        format={(value, currentValue) => {
          if (
            value.length > CARD_HOLDER_MAX_LENGTH ||
            (value.length > 0 && !CARD_HOLDER_REGEX.exec(value))
          ) {
            return currentValue;
          }
          return value.toUpperCase();
        }}
        maxLength={25}
      />

      <SaveCardInput />
    </View>
  );
};
