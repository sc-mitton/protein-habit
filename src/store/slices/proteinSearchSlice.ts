import { z } from "zod";

import apiSlice from "./apiSlice";

const proteinSearchSchema = z.object({
  results: z.array(
    z.object({
      food_item: z.string(),
      protein_amount: z.coerce.number(),
      protein_unit: z.string(),
    }),
  ),
});

export type ProteinSearchResults = z.infer<typeof proteinSearchSchema>;

const proteinSearchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchProtein: builder.mutation<
      z.infer<typeof proteinSearchSchema>,
      string
    >({
      query: (search) => ({
        url: "/protein",
        method: "POST",
        body: { text: search },
      }),
      transformResponse: (response: z.infer<typeof proteinSearchSchema>) => {
        return proteinSearchSchema.parse(response);
      },
    }),
  }),
});

export const { useSearchProteinMutation } = proteinSearchApiSlice;
