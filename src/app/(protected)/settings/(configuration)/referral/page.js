"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Settings, Save } from "lucide-react";

const ReferralPage = () => {
  const { PROFIT_MAP } = useContext(ConfigContext) || {};
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  // Initialize form data with 6 levels
  useEffect(() => {
    const initialData = {};
    for (let i = 1; i <= 6; i++) {
      initialData[i] = PROFIT_MAP?.[i] ? PROFIT_MAP[i] * 100 : 0; // Convert to percentage or default to 0
    }
    setFormData(initialData);
  }, [PROFIT_MAP]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", {
        key: "PROFIT_MAP",
        value: Object.fromEntries(
          Object.entries(formData).map(([level, value]) => [
            level,
            parseFloat(value) / 100, // Convert back to fraction
          ])
        ),
      }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text:
          response.data.message ||
          "Referral commission settings updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update commission settings",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
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
              Referral Commission
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure commission percentages for different referral levels
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(formData).map(([level, value]) => (
              <div key={level} className="space-y-3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={value}
                  label={`Level ${level} (%)`}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [level]: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  size="sm"
                  required
                  icon={() => <span className="text-gray-400">%</span>}
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

export default ReferralPage;
