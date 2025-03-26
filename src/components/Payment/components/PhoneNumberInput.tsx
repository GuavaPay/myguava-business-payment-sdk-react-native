import parsePhoneNumber, { AsYouType } from "libphonenumber-js";
import { useFormContext } from "react-hook-form";

import { TextInputField } from "./TextInputField";
import { useGuavapayPaymentsContext } from "../../Payment/context";

export const PhoneNumberInput = ({
  name = "contactPhone",
}: {
  name?: string;
}) => {
  const { strings, isLoading, isPayerInfoRequired, order } =
    useGuavapayPaymentsContext();
  const { getFieldState, watch } = useFormContext();
  const emailFieldState = getFieldState("contactEmail");
  const emailValue = watch("contactEmail");

  const isPhoneRequired =
    isPayerInfoRequired &&
    ((emailFieldState.invalid && emailValue) || !emailValue?.trim());

  const payerPhone = order?.data?.order?.payer?.maskedContactPhone?.formatted;

  return (
    <TextInputField
      editable={!isLoading}
      label={strings.contactPhone.label}
      name={name}
      rules={{
        required: isPhoneRequired,
        maxLength: {
          value: 200,
          message: strings.contactPhone.invalid,
        },
        validate: {
          isValid: (value: string) => {
            if (!value.trim()) {
              return true;
            }
            try {
              const phone = parsePhoneNumber(value);
              return phone.isValid() || strings.contactPhone.invalid;
            } catch {
              return strings.contactPhone.invalid;
            }
          },
        },
      }}
      mask={["+", ...new Array(40).fill(/[\d\s]/)]}
      format={(text = "") => {
        const phone = new AsYouType().input(text);
        return phone;
      }}
      defaultValue=""
      placeholder={payerPhone || strings.contactPhone.placeholder}
    />
  );
};
