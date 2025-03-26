import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { api, ApiError } from "@/clients";

export type ResolveCardRequest = {
  rangeIncludes: string;
};

export type CardScheme =
  | "VISA"
  | "MASTERCARD"
  | "UNIONPAY"
  | "AMERICAN_EXPRESS"
  | "DINERS_CLUB";

export type ResolveCardResponse = {
  cardScheme: CardScheme;
  product: {
    id: string;
    brand: string;
    category: string;
  };
};

const resolveCard = async (req: ResolveCardRequest) => {
  const response = await api<ResolveCardResponse>(`/card-range/resolve`, {
    method: "POST",
    data: req,
  });

  return response.data;
};

export const useResolveCard = (
  options?: UseQueryOptions<
    ResolveCardResponse,
    ApiError,
    ResolveCardResponse,
    [string, string]
  >,
) =>
  useQuery({
    queryKey: options?.queryKey as [string, string],
    queryFn: ({ queryKey }) => {
      const [_, pan] = queryKey;
      return resolveCard({ rangeIncludes: pan });
    },
    staleTime: Infinity,
    ...options,
  });
