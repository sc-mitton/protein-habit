import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AttestRequest {
  attestation: string;
  keyId: string;
  challenge: string;
}

interface AttestResponse {
  status: string;
  keyId: string;
}

export const attestApi = createApi({
  reducerPath: "attestApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    challenge: builder.mutation<string, void>({
      query: () => "challenge",
    }),
    attest: builder.mutation<AttestResponse, AttestRequest>({
      query: (body) => ({
        url: "attest",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useChallengeMutation, useAttestMutation } = attestApi;
