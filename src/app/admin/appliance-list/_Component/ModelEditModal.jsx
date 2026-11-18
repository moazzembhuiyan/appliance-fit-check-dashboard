import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useUpdateApplianceModelMutation } from "@/redux/api/applianceModelApi";
import { Button, Modal } from "antd";
import React from "react";
import toast from "react-hot-toast";

export default function ModelEditModal({ open, setOpen, selectedModel }) {
  // update model api enndpoint
  const [updateModel, { isLoading }] = useUpdateApplianceModelMutation();
  const onSubmit = async (data) => {
    const payload = {
      model: data.model,
      height: Number(data.height),
      width: Number(data.width),
      depth: Number(data.depth),
    };
    try {
      const res = await updateModel({
        id: selectedModel?._id,
        data: payload,
      }).unwrap();
      if (res.success) {
        toast.success("Model Updated Successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update model");
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
        title="Edit Appliance Model"
      >
        <FormWrapper
          onSubmit={onSubmit}
          defaultValues={{
            model: selectedModel?.model,
            height: selectedModel?.height,
            width: selectedModel?.width,
            depth: selectedModel?.depth,
          }}
        >
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
            Save Changes
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}
