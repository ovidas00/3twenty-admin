"use client";

import { useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import {
  Settings,
  Calendar,
  Percent,
  Coins,
  Save,
  TrendingUp,
} from "lucide-react";

const StakingPage = () => {
  const { STAKING_DETAILS } = useContext(ConfigContext) || {};

  const [stakingDetails, setStakingDetails] = useState({
    durationDays: 0,
    apy: 0,
    minimum: 0,
    maximum: 0,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (STAKING_DETAILS) {
      setStakingDetails({
        durationDays: STAKING_DETAILS.durationDays || 0,
        apy: STAKING_DETAILS.apy || 0,
        minimum: STAKING_DETAILS.minimum || 0,
        maximum: STAKING_DETAILS.maximum || 0,
      });
    }
  }, [STAKING_DETAILS]);

  const handleChange = (field, value) => {
    setStakingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", { key: "STAKING_DETAILS", value: stakingDetails }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Staking settings updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update staking settings",
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
      case "durationDays":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "apy":
        return <Percent className="w-4 h-4 text-green-600" />;
      case "minimum":
        return <Coins className="w-4 h-4 text-yellow-600" />;
      case "maximum":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "durationDays":
        return "Duration (Days)";
      case "apy":
        return "APY (%)";
      case "minimum":
        return "Minimum Stake";
      case "maximum":
        return "Maximum Stake";
      default:
        return field;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Staking Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure staking duration, APY, and investment limits
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
            {Object.entries(stakingDetails).map(([field, value]) => (
              <div key={field} className="space-y-3">
                <Input
                  type="number"
                  step={
                    field === "apy"
                      ? "0.01"
                      : field === "durationDays"
                      ? "1"
                      : "0.01"
                  }
                  min={field === "durationDays" ? "1" : "0"}
                  value={value}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder="0"
                  size="sm"
                  required={true}
                  label={getFieldLabel(field)}
                  icon={() => (
                    <span className="text-gray-400">
                      {field === "apy" ? (
                        "%"
                      ) : field === "durationDays" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        "$"
                      )}
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

export default StakingPage;
