import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useAddApplianceModelMutation } from "@/redux/api/applianceModelApi";
import { Button, Modal } from "antd";
import React from "react";
import toast from "react-hot-toast";

export default function AddModelForm({ open, setOpen, type }) {
  // add model api enndpoint
  const [addModel, { isLoading }] = useAddApplianceModelMutation();
  const onSubmit = async (data) => {
    const payload = {
      height: Number(data?.height),
      width: Number(data?.width),
      depth: Number(data?.depth),
      model: data?.model,
      type: type,
    };
    try {
      const res = await addModel(payload).unwrap();

      if (res.success) {
        toast.success("Model Added Successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add model");
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={800}
      >
        <FormWrapper onSubmit={onSubmit}>
          <h1 className="mb-6 text-xl font-bold text-green-900">
            Add New Appliance Model for{" "}
            <span className="uppercase text-black">{type}</span>
          </h1>
          <UInput
            name="model"
            label="Model Name"
            type="text"
            placeholder="Model Name"
          />
          <UInput
            name="height"
            label="Height"
            type="number"
            placeholder="Height"
          />
          <UInput
            name="width"
            label="Width"
            type="number"
            placeholder="Width"
          />
          <UInput
            name="depth"
            label="Depth"
            type="number"
            placeholder="Depth"
          />
          <Button
            loading={isLoading}
            disabled={isLoading}
            htmlType="submit"
            className="mt-4 w-full rounded-lg bg-gradient-to-br from-[#145880] to-[#22C55E] px-4 py-2 text-white transition hover:bg-green-900"
          >
            Submit
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}
