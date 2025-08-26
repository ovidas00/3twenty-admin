"use client";

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../layout";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    <div className="bg-white p-4 md:p-6">
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
        <Input
          type="number"
          step="0.01"
          min="0"
          label="Activation USDT (USDT)"
          icon={() => <span className="text-gray-500">$</span>}
          value={activationUSDT}
          onChange={(e) => setActivationUSDT(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          size="sm"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default ActivationPage;
