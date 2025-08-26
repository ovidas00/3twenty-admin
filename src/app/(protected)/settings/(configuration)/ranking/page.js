"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    <div className="bg-white p-4 md:p-6">
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
          <Input
            key={rank}
            type="number"
            min="0"
            label={`Rank ${rank}`}
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [rank]: parseFloat(e.target.value) || 0,
              }))
            }
            size="sm"
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

export default RankingPage;
