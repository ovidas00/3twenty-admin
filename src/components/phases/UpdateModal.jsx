"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

const UpdateModal = ({ isOpen, onClose, selectedPhase }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    price: "",
    description: "",
  });

  // preload selectedPhase data
  useEffect(() => {
    if (selectedPhase) {
      setFormData({
        name: selectedPhase.name || "",
        start: selectedPhase.start?.slice(0, 10) || "",
        end: selectedPhase.end?.slice(0, 10) || "",
        price: selectedPhase.price || "",
        description: selectedPhase.description || "",
      });
    }
  }, [selectedPhase]);

  const updateMutation = useMutation({
    mutationFn: () => api.put(`phases/${selectedPhase.id}`, formData),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["phases"] });
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`phases/${selectedPhase.id}`),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["phases"] });
      onClose();
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
    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this phase?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Phase" size="md">
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
        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Delete
          </Button>

          <div className="flex gap-3">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dark"
              size="md"
              className="px-6"
              isLoading={updateMutation.isPending}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateModal;
