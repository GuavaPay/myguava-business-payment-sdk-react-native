import { DeepPartial } from "../types";

export const strings = {
  threeDS: {
    title: "Secure checkout",
    cancelText: "Cancel",
  },
  pay: "Pay",
  rename: "Rename",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  savedCards: "Saved cards",
  addNewCard: "Add new card",
  saveCard: "Save the card for future payments",
  deleteCard:
    "Are you sure you want to delete {card}? This action cannot be undone.",
  contactInfo: "Your contact information",
  changeInfo: "Change info",
  contactPhone: {
    label: "Contact phone",
    required: "Contact phone is required.",
    invalid: "Contact phone is invalid.",
    placeholder: "Contact phone",
  },
  contactEmail: {
    label: "Contact email",
    required: "Contact email is required.",
    invalid: "Contact email is invalid.",
    placeholder: "Contact email",
  },
  cardName: {
    label: "Card name",
    required: "Card name is required.",
    invalid: "Card name is invalid.",
    placeholder: "Card name",
  },
  cardNumber: {
    label: "Card number",
    required: "Card number is required.",
    invalid: "Card number is invalid.",
    placeholder: "1234 5678 9012 3456",
  },
  expiryDate: {
    label: "Card expiry date",
    required: "Exp. date is required.",
    invalid: "This expiration date looks invalid.",
    placeholder: "MM/YY",
  },
  cvv2: {
    label: "CVC2 / CVV2",
    required: "Security code is required.",
    invalid: "This security code looks invalid.",
    placeholder: "* * *",
  },
  cardholderName: {
    label: "Cardholder name",
    required: "Cardholder name is required.",
    invalid: "Cardholder name looks invalid.",
    placeholder: "JOHN DOE",
  },
  platformPayText: "",
};

export default strings;

type StringsType = typeof strings;

export type Strings = DeepPartial<StringsType>;
