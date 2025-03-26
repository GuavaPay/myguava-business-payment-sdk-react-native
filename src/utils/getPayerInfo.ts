import parsePhoneNumber from "libphonenumber-js";

import { Payer } from "@/types";

export const getPayerInfo = ({
  contactEmail,
  contactPhone,
}: {
  contactEmail: string;
  contactPhone: string;
}) => {
  if (!contactPhone.trim() && !contactEmail.trim()) {
    return undefined;
  }

  const payer: Payer = {};

  try {
    const phone = parsePhoneNumber(contactPhone);

    payer.contactPhone = {
      countryCode: phone.countryCallingCode,
      nationalNumber: phone.nationalNumber,
    };
  } catch {}

  if (contactEmail.trim()) {
    payer.contactEmail = contactEmail.trim();
  }

  return payer;
};
