"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import {
  Settings,
  DollarSign,
  Save,
  Download,
  Upload,
  Coins,
  CreditCard,
} from "lucide-react";

const LimitsPage = () => {
  const { minimumDeposit, minimumWithdraw, minimumBuyToken, withdrawCharge } =
    useContext(ConfigContext) || {};

  const [formData, setFormData] = useState({
    minimumDeposit: 0,
    minimumWithdraw: 0,
    minimumBuyToken: 0,
    withdrawCharge: 0,
  });
  const [message, setMessage] = useState(null);

  // Set initial form data from config
  useEffect(() => {
    setFormData({
      minimumDeposit: minimumDeposit || 0,
      minimumWithdraw: minimumWithdraw || 0,
      minimumBuyToken: minimumBuyToken || 0,
      withdrawCharge: withdrawCharge || 0,
    });
  }, [minimumDeposit, minimumWithdraw, minimumBuyToken, withdrawCharge]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", { key: "DEPOSIT_SETTINGS", value: formData }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Settings updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update settings",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case "minimumDeposit":
        return <Download className="w-4 h-4 text-blue-600" />;
      case "minimumWithdraw":
        return <Upload className="w-4 h-4 text-green-600" />;
      case "minimumBuyToken":
        return <Coins className="w-4 h-4 text-yellow-600" />;
      case "withdrawCharge":
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatLabel = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border border-gray-200 shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Financial Limits
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure minimum amounts and fees for transactions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <Alert
              message={message.text}
              type={message.type}
              className="col-span-full"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(formData).map(([field, value]) => (
              <div key={field} className="space-y-3">
                <Input
                  type="number"
                  label={formatLabel(field)}
                  step="0.01"
                  min="0"
                  value={value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  size="sm"
                  required={true}
                  icon={() => (
                    <span className="text-gray-400">
                      {field === "withdrawCharge" ? "%" : "$"}
                    </span>
                  )}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default LimitsPage;
