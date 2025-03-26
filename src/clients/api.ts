import axios, { AxiosError } from "axios";

export const URL = {
  dev: "https://cardium-cpg-dev.guavapay.com",
  preprod: "https://sandbox-pgw.myguava.com",
  prod: "https://pay.guavapay.com",
  local: process.env.EXPO_PUBLIC_LOCAL,
};

const env = (process.env.EXPO_PUBLIC_ENV as keyof typeof URL) || "prod";

export const baseURL = URL[env];

export const api = axios.create({
  baseURL,
});

export type ApiError = AxiosError;
