import { AmexIcon } from "./AmexIcon";
import { MasterCardIcon } from "./MasterCardIcon";
import { UnionpayIcon } from "./UnionpayIcon";
import { VisaIcon } from "./VisaIcon";

import { CardScheme } from "@/hooks/api/useResolveCard";

export const PaymentIcons: Record<
  Exclude<CardScheme, "DINERS_CLUB">,
  React.ComponentType
> = {
  VISA: VisaIcon,
  MASTERCARD: MasterCardIcon,
  AMERICAN_EXPRESS: AmexIcon,
  UNIONPAY: UnionpayIcon,
};
