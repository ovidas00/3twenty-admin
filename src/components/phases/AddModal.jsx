"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AddModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    supply: "",
    price: "",
    description: "",
  });

  const addMutation = useMutation({
    mutationFn: () => api.post("phases", formData),
    onSuccess: (response) => {
      toast.success(response.data.message);
      setFormData({
        name: "",
        start: "",
        end: "",
        supply: "",
        price: "",
        description: "",
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["phases"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Phase" size="md">
      <form className="space-y-4 p-2" onSubmit={handleSubmit}>
        {/* Name */}
        <Input
          id="name"
          name="name"
          type="text"
          label="Phase Name"
          required
          placeholder="Enter phase name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Description */}
        <Input
          id="description"
          name="description"
          type="text"
          label="Description"
          maxLength={100}
          placeholder="Enter a short description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Start Date */}
        <Input
          id="start"
          name="start"
          type="date"
          label="Start Date"
          required
          value={formData.start}
          onChange={handleChange}
        />

        {/* End Date */}
        <Input
          id="end"
          name="end"
          type="date"
          label="End Date"
          required
          value={formData.end}
          onChange={handleChange}
        />

        {/* Supply */}
        <Input
          id="supply"
          name="supply"
          type="number"
          label="Total Supply"
          required
          placeholder="Enter supply amount"
          value={formData.supply}
          onChange={handleChange}
        />

        {/* Price */}
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          label="Price per token"
          min="0.01"
          required
          placeholder="Enter price"
          value={formData.price}
          onChange={handleChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="dark"
            size="md"
            className="px-6"
            isLoading={addMutation.isPending}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddModal;
