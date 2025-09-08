"use client";

import { useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Settings, Coins, Users, Save, DollarSign } from "lucide-react";

const FounderPage = () => {
  const { FOUNDER_DETAILS } = useContext(ConfigContext) || {};

  const [founderDetails, setFounderDetails] = useState({
    minimumInvestment: 0,
    totalSeat: 0,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (FOUNDER_DETAILS) {
      setFounderDetails({
        minimumInvestment: FOUNDER_DETAILS.minimumInvestment || 0,
        totalSeat: FOUNDER_DETAILS.totalSeat || 0,
      });
    }
  }, [FOUNDER_DETAILS]);

  const handleChange = (field, value) => {
    setFounderDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put("/configs", { key: "FOUNDER_DETAILS", value: founderDetails }),
    onSuccess: (response) => {
      setMessage({
        type: "success",
        text: response.data.message || "Founder settings updated successfully",
      });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update founder settings",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "minimumInvestment":
        return "Minimum Investment";
      case "totalSeat":
        return "Total Seats";
      default:
        return field;
    }
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case "minimumInvestment":
        return <DollarSign className="w-4 h-4 text-gray-400" />;
      case "totalSeat":
        return <Users className="w-4 h-4 text-gray-400" />;
      default:
        return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Founder Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure minimum investment and total seats
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(founderDetails).map(([field, value]) => (
            <div key={field} className="space-y-3">
              <Input
                type="number"
                step="1"
                min="0"
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder="0"
                size="sm"
                required={true}
                label={getFieldLabel(field)}
                icon={() => (
                  <span className="text-gray-400">{getFieldIcon(field)}</span>
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
  );
};

export default FounderPage;
