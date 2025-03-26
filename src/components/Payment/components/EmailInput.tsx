import { TextInputField } from "./TextInputField";
import { useGuavapayPaymentsContext } from "../../Payment/context";

export const EmailInput = ({ name = "contactEmail" }: { name?: string }) => {
  const { strings, isLoading, order } = useGuavapayPaymentsContext();

  const payerEmail = order?.data?.order?.payer?.maskedContactEmail;

  return (
    <TextInputField
      editable={!isLoading}
      label={strings.contactEmail.label}
      name={name}
      keyboardType="email-address"
      rules={{
        pattern: {
          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          message: strings.contactEmail.invalid,
        },
        // required: strings.contactEmail.required,
        maxLength: {
          value: 200,
          message: strings.contactEmail.invalid,
        },
      }}
      autoCapitalize="none"
      defaultValue=""
      placeholder={payerEmail || strings.contactEmail.placeholder}
    />
  );
};
