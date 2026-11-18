"use client";
import {
  useDeleteAllApplianceModelMutation,
  useGetAllApplianceModelsTypesQuery,
} from "@/redux/api/applianceModelApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AddNewTypeForm from "./AddNewTypeForm";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Trash } from "lucide-react";
import UploadCsvFile from "./UploadCsvFile";
import toast from "react-hot-toast";

export default function ApplicanceListContainer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  // delete all model of a type
  const [deleteType, { isLoading: isDeleting }] =
    useDeleteAllApplianceModelMutation();
  // fetch all types
  const { data: modelTypeData, isLoading } =
    useGetAllApplianceModelsTypesQuery();

  const types = modelTypeData?.data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center font-medium text-green-700">
        Loading appliance types...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">
          Appliance Types ({types.length})
        </h1>

        <div className="flex gap-4">
          {/* <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:opacity-90"
          >
            Add New Type
          </button> */}
          {/* <button
            onClick={() => setCsvModalOpen(true)}
            className="rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:opacity-90"
          >
            Upload CSV
          </button> */}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {types?.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              router.push(`/admin/appliance-list/eachType?type=${item?.type}`)
            }
            className="cursor-pointer rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] p-4 text-white shadow-md transition hover:scale-[1.03]"
          >
            {/* TITLE */}
            <h3 className="mb-2 line-clamp-2 text-base font-semibold">
              {item?.type}
            </h3>

            {/* COUNT */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-green-100">Model Count</span>
              <span className="rounded-md bg-green-900 px-2 py-1 text-lg font-bold">
                {item?.modelCount}
              </span>
            </div>

            {/* DELETE BUTTON */}
            <div
              className="mt-4 flex justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <CustomConfirm
                text="Delete"
                title="Delete Appliance Models"
                description="Are you sure you want to delete this appliance models? This action cannot be undone."
                onConfirm={() => {
                  try {
                    const res = deleteType({ type: item.type });
                    if (res) {
                      toast.success("Appliance Models deleted successfully");
                    }
                  } catch (error) {
                    toast.error("Failed to delete appliance models");
                  }
                }}
              >
                <button className="rounded-md bg-red-600 px-2 py-2 text-xs transition hover:bg-red-700">
                  <Trash size={14} />
                </button>
              </CustomConfirm>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <AddNewTypeForm open={open} setOpen={setOpen} />

      <UploadCsvFile open={csvModalOpen} setOpen={setCsvModalOpen} />
    </div>
  );
}
