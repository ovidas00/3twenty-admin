"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api"; // adjust API import
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

const LimitsPage = () => {
  const { minimumDeposit, minimumWithdraw, minimumBuyToken } =
    useContext(ConfigContext) || {};

  const [formData, setFormData] = useState({
    minimumDeposit: 0,
    minimumWithdraw: 0,
    minimumBuyToken: 0,
  });
  const [message, setMessage] = useState(null);

  // Set initial form data from config
  useEffect(() => {
    setFormData({
      minimumDeposit: minimumDeposit || 0,
      minimumWithdraw: minimumWithdraw || 0,
      minimumBuyToken: minimumBuyToken || 0,
    });
  }, [minimumDeposit, minimumWithdraw, minimumBuyToken]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", { key: "DEPOSIT_SETTINGS", value: formData }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Deposit settings updated successfully",
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
    setMessage(null); // reset message
    updateMutation.mutate();
  };

  const formatLabel = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="bg-white p-4 md:p-6  rounded-lg shadow-sm border border-gray-200">
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

        {Object.entries(formData).map(([field, value]) => (
          <Input
            key={field}
            type="number"
            step="0.01"
            min="0"
            label={formatLabel(field)}
            icon={() => <span className="text-gray-500">$</span>}
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [field]: e.target.value,
              }))
            }
            size="sm"
            required={true}
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

export default LimitsPage;
