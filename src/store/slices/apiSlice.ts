import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

import AttestModule from "attest";

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
    const challenge = await AsyncStorage.getItem("challenge");
    const keyId = await AsyncStorage.getItem("keyId");
    const clientData = { ...data, challenge };
    const assertion = await AttestModule.asyncGenerateAssertion(
      JSON.stringify(clientData),
    );

    try {
      const result = await axios({
        url: baseUrl + url,
        headers: {
          ...headers,
          "x-challenge": challenge,
          "x-key-id": keyId,
          "x-assertion": assertion,
        },
        ...rest,
      });
      return { data: result.data };
    } catch (axiosError) {
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
  baseQuery: axiosBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  endpoints: (builder) => ({}),
  tagTypes,
});

export default apiSlice;
