"use client";

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../layout";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && <Alert message={message.text} type={message.type} />}
        <Input
          type="number"
          step="0.01"
          min="0"
          label="Activation USDT (USDT)"
          icon={() => <span className="text-gray-500">$</span>}
          value={activationUSDT}
          onChange={(e) => setActivationUSDT(e.target.value)}
          placeholder="0.00"
          size="sm"
          required={true}
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
