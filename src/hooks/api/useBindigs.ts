import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { api, ApiError, queryClient } from "@/clients";
import { useGuavapayPaymentsContext } from "@/components/Payment/context";
import { CardProductCategory, CardScheme } from "@/types";
import { getQueryParams } from "@/utils";

export type SortingRule = "lastUseDate" | "creationDate";
export type SortingOrder = "asc" | "desc";

export type BindingsRequest = {
  page?: number;
  size?: number;
  sort?: `${SortingRule},${SortingOrder}`;
  cardScheme?: CardScheme;
};

export type BindingCard = {
  maskedPan: string;
  expiryDate: string;
  cardScheme: CardScheme;
};

export type BindingProduct = {
  category?: CardProductCategory;
};

export type Binding = {
  id: string;
  payerId?: string;
  creationDate: string;
  lastUseDate: string;
  name: string;
  activity: boolean;
  cardData: BindingCard;
  product?: BindingProduct;
};

export type BindingsResponse = {
  data: Binding[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type SelectedBindingsResponse = Omit<BindingsResponse, "data"> & {
  data?: {
    all: Binding[];
    accepted: Binding[];
    rejected: Binding[];
  };
};

const getBindings = async ({
  page,
  size,
  sort,
  cardScheme,
}: BindingsRequest) => {
  const query = getQueryParams(
    page && `page=${page}`,
    size && `size=${size}`,
    sort && `sort=${sort}`,
    cardScheme && `card-scheme=${cardScheme}`,
  );

  const response = await api<BindingsResponse>(`/bindings${query}`, {
    method: "GET",
  });
  return response.data;
};

export const useBindings = (
  request: BindingsRequest,
  options?: Omit<
    UseQueryOptions<BindingsResponse, ApiError, BindingsResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  const {
    order: { data: orderDetails },
  } = useGuavapayPaymentsContext();
  const { data: bindings, ...rest } = useQuery({
    queryKey: ["bindings", request],
    queryFn: () => getBindings(request),
    ...options,
  });

  const availableBindings =
    bindings?.data?.filter(
      ({ cardData: { cardScheme } }) =>
        orderDetails?.order.availableCardSchemes?.includes(cardScheme) || false,
    ) || [];

  const acceptedBindings: Binding[] = [];
  const rejectedBindings: Binding[] = [];

  availableBindings.forEach((card) => {
    const { product } = card;

    if (
      !product?.category ||
      !orderDetails?.order.availableCardProductCategories ||
      orderDetails.order.availableCardProductCategories.includes(
        product.category,
      )
    ) {
      acceptedBindings.push(card);
    } else {
      rejectedBindings.push(card);
    }
  });

  return {
    data: {
      all: availableBindings,
      accepted: acceptedBindings,
      rejected: rejectedBindings,
    },
    ...rest,
  };
};

export const refetchBindings = () => {
  queryClient.refetchQueries({ queryKey: ["bindings"] });
};
