"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api"; // adjust API import
import { ConfigContext } from "../layout";

const LimitsPage = () => {
  const { DEPOSIT_SETTINGS } = useContext(ConfigContext) || {};
  const [formData, setFormData] = useState({
    minimumDeposit: 0,
    minimumWithdraw: 0,
    minimumBuyToken: 0,
  });
  const [message, setMessage] = useState(null);

  // Set initial form data from config
  useEffect(() => {
    if (DEPOSIT_SETTINGS) {
      setFormData({
        minimumDeposit: DEPOSIT_SETTINGS.minimumDeposit || 0,
        minimumWithdraw: DEPOSIT_SETTINGS.minimumWithdraw || 0,
        minimumBuyToken: DEPOSIT_SETTINGS.minimumBuyToken || 0,
      });
    }
  }, [DEPOSIT_SETTINGS]);

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {message && (
          <div
            className={`col-span-full p-2 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {Object.entries(formData).map(([field, value]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formatLabel(field)}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        ))}

        <div className="col-span-full flex justify-start mt-2">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {updateMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LimitsPage;
