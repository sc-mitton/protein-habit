import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import AppIntegrity, { getAppIntegrity } from "app-integrity";
import Constants from "expo-constants";
const tagTypes = ["ProteinSearch"];

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, headers, data, ...rest }) => {
    const { body, ...moreRest } = rest as any;
    const integrityHeaders: Record<string, string | null> = {};

    if (process.env.NODE_ENV !== "development") {
      const integrity = await getAppIntegrity();

      const challenge = integrity.challenge;
      const keyId = integrity.keyId;
      const token = integrity.token;

      const challengeValue = challenge!.split(".").slice(1).join(".");
      const clientData = { ...body, challenge: challengeValue };
      let assertion = "";
      if (challenge && keyId) {
        assertion = await AppIntegrity.asyncGenerateAssertion(
          JSON.stringify(clientData),
          keyId,
        );
      }

      integrityHeaders["x-challenge"] = challenge;
      integrityHeaders["x-key-id"] = keyId;
      integrityHeaders["x-assertion"] = assertion;
      integrityHeaders["x-token"] = token;
    }

    try {
      const result = await axios({
        url: baseUrl + url,
        headers: {
          ...headers,
          ...integrityHeaders,
          "Content-Type": "application/json",
        },
        data: body,
        ...moreRest,
      });
      return { data: result.data };
    } catch (axiosError) {
      console.error("Axios error:", axiosError);
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: Constants.expoConfig?.extra?.apiUrl }),
  endpoints: (builder) => ({}),
  tagTypes,
});

export default apiSlice;
