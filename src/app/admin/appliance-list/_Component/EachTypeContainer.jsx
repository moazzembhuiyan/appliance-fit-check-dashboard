"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import {
  useDeleteApplianceModelMutation,
  useGetAllApplianceModelsByTypeQuery,
} from "@/redux/api/applianceModelApi";
import { Edit, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import ModelEditModal from "./ModelEditModal";
import toast from "react-hot-toast";
import AddModelForm from "./AddModelForm";
import UploadCsvFile from "./UploadCsvFile";

export default function EachTypeContainer() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const { data: modelListData, isLoading } =
    useGetAllApplianceModelsByTypeQuery({ type, skip: !type });

  // delete model mutation
  const [deleteModel, { isLoading: isDeleting }] =
    useDeleteApplianceModelMutation();

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ✅ FIXED: stable data reference
  const data = useMemo(() => {
    return modelListData?.data || [];
  }, [modelListData?.data]);

  // 🔍 SEARCH + SORT
  const filteredData = useMemo(() => {
    let filtered = data.filter((item) =>
      item.model.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.sort((a, b) => {
      return sortOrder === "asc"
        ? a.model.localeCompare(b.model)
        : b.model.localeCompare(a.model);
    });

    return filtered;
  }, [data, search, sortOrder]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredData, currentPage]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center font-medium text-green-700">
        Loading appliance models...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <h2 className="mb-4 text-2xl font-bold text-green-900">
        Models for: <span className="text-green-700">{type || "N/A"}</span>
      </h2>

      {/* CONTROLS */}
      <div className="mb-6 flex items-center justify-between">
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search model..."
            className="rounded-lg border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:bg-green-900"
          >
            Sort: {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>
        <div className="flex items-center justify-center gap-10">
          <button
            onClick={() => setAddModelOpen(true)}
            className="rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:bg-green-900"
          >
            Add New Model
          </button>
          <button
            onClick={() => setCsvModalOpen(true)}
            className="rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:opacity-90"
          >
            Upload CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-green-200 shadow-md">
          <thead className="bg-white text-gray-500">
            <tr>
              <th className="p-3 text-left">Model</th>
              <th className="p-3">Height</th>
              <th className="p-3">Width</th>
              <th className="p-3">Depth</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item._id}
                className="border-b transition hover:bg-green-100"
              >
                <td className="p-3 font-medium text-green-900">{item.model}</td>
                <td className="p-3 text-center">{item.height}</td>
                <td className="p-3 text-center">{item.width}</td>
                <td className="p-3 text-center">{item.depth}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        setSelectedModel(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit size={20} />
                    </button>
                    <CustomConfirm
                      title={"Delete Model"}
                      message={"Are you sure you want to delete this model?"}
                      onConfirm={async () => {
                        try {
                          const res = await deleteModel({
                            id: item._id,
                          }).unwrap();
                          if (res.success) {
                            toast.success("Model deleted successfully");
                          }
                        } catch (error) {
                          toast.error("Failed to delete model");
                        }
                      }}
                    >
                      <button className="ml-2">
                        <Trash size={20} color="red" />
                      </button>
                    </CustomConfirm>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-green-700">
                  No models found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="rounded bg-green-700 px-3 py-1 text-white disabled:opacity-40"
        >
          Prev
        </button>

        <span className="font-medium text-green-900">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="rounded bg-green-700 px-3 py-1 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* modals */}
      <ModelEditModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedModel={selectedModel}
      />

      <AddModelForm open={addModelOpen} setOpen={setAddModelOpen} type={type} />

      <UploadCsvFile open={csvModalOpen} setOpen={setCsvModalOpen} />
    </div>
  );
}
