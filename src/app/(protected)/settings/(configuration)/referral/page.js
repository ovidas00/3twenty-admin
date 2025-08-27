"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

const ReferralPage = () => {
  const { PROFIT_MAP } = useContext(ConfigContext) || {};
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  // Initialize form data from config
  useEffect(() => {
    if (PROFIT_MAP) {
      const initialData = {};
      Object.entries(PROFIT_MAP).forEach(([level, value]) => {
        initialData[level] = value * 100; // Convert to percentage for input
      });
      setFormData(initialData);
    }
  }, [PROFIT_MAP]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", {
        key: "PROFIT_MAP",
        value: Object.fromEntries(
          Object.entries(formData).map(([level, value]) => [
            level,
            parseFloat(value) / 100, // Convert back to fraction
          ])
        ),
      }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text:
          response.data.message ||
          "Referral profit settings updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {message && (
          <Alert
            message={message.text}
            type={message.type}
            className="col-span-full"
          />
        )}

        {Object.entries(formData).map(([level, value]) => (
          <Input
            key={level}
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [level]: e.target.value === "" ? 0 : parseFloat(e.target.value),
              }))
            }
            size="sm"
            label={`Level ${level} (%)`}
          />
        ))}

        <div className="col-span-full flex justify-start mt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReferralPage;
