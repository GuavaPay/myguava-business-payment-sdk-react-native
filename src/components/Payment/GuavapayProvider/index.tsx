import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, PropsWithChildren } from "react";

import { GuavapayPaymentsProvider, InitProps } from "../context";

import { api, URL, queryClient } from "@/clients";

export const GuavapayProvider = ({
  children,
  ...props
}: PropsWithChildren<InitProps>) => {
  const [setupCompleted, setSetupCompleted] = useState(false);

  useEffect(() => {
    api.defaults.headers.common["Authorization"] =
      `Bearer ${props.sessionToken}`;

    if (props.env) {
      api.defaults.baseURL = URL[props.env];
    }
    setSetupCompleted(true);
  }, [props.orderId, props.sessionToken]);

  if (!setupCompleted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GuavapayPaymentsProvider {...props}>{children}</GuavapayPaymentsProvider>
    </QueryClientProvider>
  );
};
