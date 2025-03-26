import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { Binding, refetchBindings } from "./useBindigs";

import { api, ApiError } from "@/clients";

export type UpdateBindingRequest = {
  id: string;
  name: string;
};

export type UpdateBindingResponse = {
  binding: Pick<Binding, "id" | "name" | "activity">;
};

const updateBinding = async ({ id, ...data }: UpdateBindingRequest) => {
  const response = await api<UpdateBindingResponse>(`/binding/${id}`, {
    method: "PATCH",
    data,
  });

  return response.data;
};

export const useUpdateBinding = (
  options?: UseMutationOptions<
    UpdateBindingResponse,
    ApiError,
    UpdateBindingRequest
  >,
) => {
  return useMutation({
    mutationFn: (req: UpdateBindingRequest) => updateBinding(req),
    onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context);
      refetchBindings();
    },
    ...options,
  });
};
