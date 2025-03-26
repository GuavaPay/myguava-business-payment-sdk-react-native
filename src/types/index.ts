export enum PaymentMethod {
  PaymentCard = "PAYMENT_CARD",
  SavedPaymentCard = "PAYMENT_CARD_BINDING",
  ApplePay = "APPLE_PAY",
  GooglePay = "GOOGLE_PAY",
  BankAccount = "BANK_ACCOUNT",
  ClickToPay = "CLICK_TO_PAY",
  Crypto = "CRYPTOCURRENCY",
}

export type Merchant = {
  name?: string;
  country?: {
    alpha2Code: string;
  };
};

export type PaymentMethodInfo = {
  type: PaymentMethod;
};

export type OrderPaymentResult = {
  code?: string;
  message?: string;
};

export type OrderPaymentReversal = {
  result: OrderPaymentResult;
  reason: string;
};

export type AmountSchema = {
  baseUnits: number;
  currency: string;
  localized: string;
  minorSubunits: number;
};

export type Payment = {
  id?: string;
  date?: string;
  result?: OrderPaymentResult;
  rrn?: string;
  authCode?: string;
  reversal?: OrderPaymentReversal;
  paymentMethod?: PaymentMethodInfo;
  exchangeRate?: number;
  amount?: AmountSchema;
};

export enum OrderStatus {
  /** Order is registered. No payment attempts yet. */
  Created = "CREATED",
  /** Payment for order is completed successfully. */
  Paid = "PAID",
  /** Payment for order is declined. */
  Declined = "DECLINED",
  /** Part of amount of the order is refunded. */
  PartiallyRefunded = "PARTIALLY_REFUNDED",
  /** Full amount of the order is refunded. */
  Refunded = "REFUNDED",
  /** Payment for the order is reversed. */
  Cancelled = "CANCELLED",
  /** Order is expired. */
  Expired = "EXPIRED",
  /** Order is ready to recurrence payments. */
  ReccurenceActive = "RECURRENCE_ACTIVE",
  /** Order is not ready to recurrence payments. */
  ReccurenceClosed = "RECURRENCE_CLOSED",
}

export const UNFINAL_STATUS = [OrderStatus.Created];
export const SUCCESSFUL_STATUS = [
  OrderStatus.Paid,
  OrderStatus.Refunded,
  OrderStatus.PartiallyRefunded,
  OrderStatus.ReccurenceActive,
  OrderStatus.ReccurenceClosed,
];
export const UNSUCCESSFUL_STATUS = [
  OrderStatus.Cancelled,
  OrderStatus.Declined,
  OrderStatus.Expired,
];

export type ContactPhone = {
  /** Phone country code. The nationalNumber field is required if the country code is present. */
  countryCode?: string;
  /** Phone number without country code. The countryCode field is required if the national phone number is present. */
  nationalNumber?: string;
};

export type PayerAddress = {
  /** 2-letter ISO 3166-1 ccountry code.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  country: string;
  /** City name.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  city: string;
  /** ISO 3166-2 subdivision code.
   *
   * Must be present always when country field provided with Canada or United States value. */
  state: string;
  /** ZIP code.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  zipCode: string;
  /** Address line 1.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  addressLine1: string;
  /** Address line 2. */
  addressLine2?: string;
};

export type Payer = {
  /** Input mode for payer data */
  inputMode?: PayerDataInputMode;
  /** The first name of the payer. Should be present for order with the purpose field in the TRANSFER value. */
  firstName?: string;
  /** The last name of the payer. Should be present for order with the purpose field in the TRANSFER value. */
  lastName?: string;
  /** E-mail address */
  contactEmail?: string;
  /** Phone number can be provided in 3 combinations:
   *
   * - countryCode + nationalNumber
   * - country + fullNumber (domestic format)
   * - fullNumber (international format)
   *
   * The phone will not be saved for the order if it cannot be parsed as valid phone number. */
  contactPhone?: ContactPhone;
  /** The address of the payer. Should be present for order with the purpose field in the TRANSFER value. */
  address?: PayerAddress;
};

export enum PayerDataInputMode {
  /** Payer and payee are same person. Payee information (firstName, lastName, and address) will be applied for payer. */
  CopyFromPayee = "COPY_FROM_PAYEE",
  /** Payer and payee are different persons. Manually providing of the payer information is required. */
  Manual = "MANUAL",
}

export type BaseContactPhone = {
  /** Phone country code. The nationalNumber field is required if the country code is present. */
  countryCode?: string;
  /** Masked phone number without country code */
  nationalNumber?: string;
};

export type MaskedContactPhone = {
  /** Phone country code. The nationalNumber field is required if the country code is present. */
  countryCode?: string;
  /** Masked phone number without country code */
  nationalNumber?: string;
  /** Full masked phone number with country code in the international format */
  formatted?: string;
};

export type DisplayedPayer = {
  /** Identifier of payer in merchant system */
  id?: string;
  /** List of available payer data input modes. Choice of data input mode must be provided to payer if this list has more that one values. */
  availableInputModes?: PayerDataInputMode[];
  /** E-mail address */
  contactEmail: string;
  /** Phone number */
  contactPhone: BaseContactPhone;
  /** Masked e-mail address */
  maskedContactEmail?: string;
  /** Masked phone number */
  maskedContactPhone?: MaskedContactPhone;
  /** The first name of the payer. Should be present for order with the purpose field in the TRANSFER value. */
  firstName?: string;
  /** The last name of the payer. Should be present for order with the purpose field in the TRANSFER value. */
  lastName?: string;
  /** The masked first name of the payer */
  maskedFirstName?: string;
  /** The masked last name of the payer */
  maskedLastName?: string;
  /** The address of the payer */
  address?: DisplayedPayerAddress;
};

export type DisplayedPayerAddress = {
  /** 2-letter ISO 3166-1 ccountry code.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  country: string;
  /** City name.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  city: string;
  /** ISO 3166-2 subdivision code.
   *
   * Must be present always when country field provided with Canada or United States value. */
  state: string;
  /** ZIP code.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  zipCode: string;
  /** Address line 1.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  addressLine1: string;
  /** Address line 2. */
  addressLine2?: string;
  /** Masked ZIP code.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  maskedZipCode: string;
  /** Address line 1.
   *
   * Should be present for order with the purpose field in the TRANSFER value. */
  maskedAddressLine1: string;
  /** Masked address line 2. */
  maskedAddressLine2?: string;
};

export enum OrderPurpose {
  Purchase = "PURCHASE",
  Transfer = "TRANSFER",
}

export type Subtotals = {
  name: string;
  amount: AmountSchema;
  direction: "DEBIT" | "CREDIT";
};

export enum CardScheme {
  Visa = "VISA",
  MasterCard = "MASTERCARD",
  Amex = "AMERICAN_EXPRESS",
}

export enum CardProductCategory {
  Debit = "DEBIT",
  Credit = "CREDIT",
  Prepaid = "PREPAID",
}

export enum ReccurenceInitialOperation {
  /** Initial payment. Order total amount must be positive. */
  Payment = "PAYMENT",
  /** Initial account status inquiry. Order total amount must be zero. */
  PrepareForFuturePayments = "PREPARE_FOR_FUTURE_PAYMENTS",
}

export type OrderRecurrence = {
  /** Operation which must be executed on initial of recurrence */
  initialOperation?: ReccurenceInitialOperation;
};

export type OrderDescription = {
  textDescription?: string;
  items?: OrderItem[];
};

export type OrderIntermediateResultPageOptions = {
  successMerchantUrl: string;
  unsuccessMerchantUrl: string;
};

export enum CurrencyCategory {
  Fiat = "FIAT",
  Crypto = "CRYPTO",
}

export type Currency = {
  /** Fiat currency code in ISO 4217 Alpha 3 or cryptocurrency code */
  id: string;
  /** Name of the currency */
  name: string;
  /** Display code of the currency */
  displayCode?: string;
  /** Display name of the currency */
  displayName?: string;
  /** Category of the currency */
  category: CurrencyCategory;
  /** Network of the currency */
  networkName?: string;
  /** Number of decimal places of the currency */
  decimalPlaces: number;
  /** URL to the currency logo */
  logoUrl?: string;
};

export type Order = {
  id: string;
  referenceNumber?: string;
  status: OrderStatus;
  payerId?: string;
  payer?: DisplayedPayer;
  terminalId?: string;
  purpose?: OrderPurpose;
  totalAmount: AmountSchema;
  subtotals?: Subtotals[];
  refundedAmount?: AmountSchema;
  redirectUrl?: string;
  availablePaymentMethods?: PaymentMethod[];
  availableCardSchemes?: CardScheme[];
  availableCardProductCategories?: CardProductCategory[];
  availablePaymentCurrencies?: Currency["id"][];
  intermediateResultPageOptions?: OrderIntermediateResultPageOptions;
  merchantUrl?: string;
  paymentPageUrl?: string;
  shortPaymentPageUrl?: string;
  recurrence?: OrderRecurrence;
  expirationDate: string;
  shippingAddress?: string;
  description?: OrderDescription;
  requestor?: Record<string, any>;
  sessionToken?: string;
};

export type OrderItem = {
  name?: string;
  count?: number;
  barcodeNumber?: string;
  vendorCode?: string;
  productProvider?: string;
  unitPrice?: AmountSchema;
  totalCost?: AmountSchema;
  taxAmount?: AmountSchema;
  discountAmount?: AmountSchema;
};

export type Refund = {
  result?: OrderPaymentResult;
  reason?: string;
  amount: AmountSchema;
  items?: OrderItem[];
};

export type ThreeDSChallenge = {
  data: string;
  url: string;
};

export type OpenBankingAuthRequirements = {
  authorizationUrl?: string;
  qrCodeData?: string;
  expirationDate: string;
};

export type CryptoAuthRequirements = {
  walletAddress: string;
  expirationDate: string;
  networkName?: string;
  detectedAmount?: AmountSchema;
};

export type PaymentRequirements = {
  threedsChallenge?: ThreeDSChallenge;
  threedsMethod?: ThreeDSChallenge;
  payerAuthorization?: OpenBankingAuthRequirements;
  cryptocurrencyTransfer?: CryptoAuthRequirements;
  finishPageRedirect?: FinishPageRedirectRequirement;
};

export type FinishPageRedirectRequirement = {
  /** URL to which the customer is redirected to show payment attempt result */
  url?: string;
  /** Financial transaction result message */
  message?: string;
};

export type OrderDetailsResponse = {
  order: Order;
  merchant?: Merchant;
  payment?: Payment;
  refunds?: Refund[];
  paymentRequirements?: PaymentRequirements;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
