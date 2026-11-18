"use client";
import { useUploadApplianceCsvMutation } from "@/redux/api/applianceModelApi";
import { Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function UploadCsvFile({ open, setOpen }) {
  const [uploadCsv, { isLoading }] = useUploadApplianceCsvMutation();
  const [file, setFile] = useState(null);

  // 📤 handle submit
  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a CSV file");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadCsv(formData).unwrap();
      if (res.success) {
        toast.success("CSV uploaded successfully!");
        setOpen(false);
        setFile(null);
      } else {
        toast.error(res.message || "Upload failed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Upload failed!");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        setFile(null);
      }}
      footer={null}
      centered
      width={600}
      title="Upload CSV File"
    >
      <div className="space-y-4">
        {/* FILE INPUT */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full rounded-md border border-gray-300 p-2"
        />

        {/* FILE INFO */}
        {file && (
          <p className="text-sm text-green-700">
            Selected file: <b>{file.name}</b>
          </p>
        )}

        {/* ACTION BUTTON */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full rounded-md bg-green-700 py-2 text-white transition hover:bg-green-800 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>
    </Modal>
  );
}
