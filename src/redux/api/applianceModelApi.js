const { baseApi } = require("./baseApi");

const ModelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllApplianceModelsTypes: builder.query({
      query: () => ({
        url: "/appliance-models/types",
        method: "GET",
      }),
      providesTags: ["ApplianceModel"],
    }),
    getAllApplianceModelsByType: builder.query({
      query: ({ type }) => ({
        url: `/appliance-models/by-type?type=${type}`,
        method: "GET",
      }),
      providesTags: ["ApplianceModel"],
    }),

    // update model
    updateApplianceModel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/appliance-models/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ApplianceModel"],
    }),

    // delete model
    deleteApplianceModel: builder.mutation({
      query: ({ id }) => ({
        url: `/appliance-models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApplianceModel"],
    }),

    // delete model
    deleteAllApplianceModel: builder.mutation({
      query: ({ type }) => ({
        url: `/appliance-models/by-type?type=${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApplianceModel"],
    }),

    // add new model
    addApplianceModel: builder.mutation({
      query: (data) => ({
        url: `/appliance-models`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ApplianceModel"],
    }),

    // uplad csv file
    uploadApplianceCsv: builder.mutation({
      query: (data) => ({
        url: `/appliance-models/bulk-csv`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ApplianceModel"],
    }),
  }),
});

export const {
  useGetAllApplianceModelsTypesQuery,
  useGetAllApplianceModelsByTypeQuery,
  useUpdateApplianceModelMutation,
  useDeleteApplianceModelMutation,
  useAddApplianceModelMutation,
  useUploadApplianceCsvMutation,
  useDeleteAllApplianceModelMutation,
} = ModelApi;
