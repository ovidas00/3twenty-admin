"use client";

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../layout";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

const ActivationPage = () => {
  const config = useContext(ConfigContext);
  const [activationUSDT, setActivationUSDT] = useState(0);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (config?.ACTIVATION_USDT !== undefined) {
      setActivationUSDT(config.ACTIVATION_USDT);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", { key: "ACTIVATION_USDT", value: activationUSDT }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // reset message on submit
    updateMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-2 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activation USDT (USDT)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={activationUSDT}
              onChange={(e) =>
                setActivationUSDT(parseFloat(e.target.value) || 0)
              }
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
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
      </form>
    </div>
  );
};

export default ActivationPage;
