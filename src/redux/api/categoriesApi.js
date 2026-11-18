const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
