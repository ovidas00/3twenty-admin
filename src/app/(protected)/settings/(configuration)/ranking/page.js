"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";

const RankingPage = () => {
  const { RANKING_MAP } = useContext(ConfigContext) || {};
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  // Initialize form data from config
  useEffect(() => {
    if (RANKING_MAP) {
      setFormData(RANKING_MAP);
    }
  }, [RANKING_MAP]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", {
        key: "RANKING_MAP",
        value: formData, // Keep exact values
      }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Ranking settings updated successfully",
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

        {Object.entries(formData).map(([rank, value]) => (
          <div key={rank}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rank {rank}
            </label>
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [rank]: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
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

export default RankingPage;
