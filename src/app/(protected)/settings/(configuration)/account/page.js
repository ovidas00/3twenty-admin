"use client";

import { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../layout";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Settings, DollarSign, Save } from "lucide-react";

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
        text: response.data.message || "Activation fee updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update activation fee",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Activation Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure user account activation fee
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <Alert message={message.text} type={message.type} className="mb-4" />
        )}

        <Input
          type="number"
          step="0.01"
          label="Activation USDT"
          min="0"
          icon={() => <DollarSign className="w-4 h-4 text-gray-400" />}
          value={activationUSDT}
          onChange={(e) => setActivationUSDT(e.target.value)}
          placeholder="0.00"
          size="sm"
          required={true}
          className="w-full"
        />

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="dark"
            size="md"
            isLoading={updateMutation.isPending}
            icon={
              updateMutation.isPending ? null : <Save className="w-4 h-4" />
            }
            className="min-w-[120px]"
          >
            {updateMutation.isPending ? "Updating..." : "Save Changes"}
          </Button>

          {updateMutation.isPending && (
            <p className="text-sm text-gray-500">Updating activation fee...</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActivationPage;
