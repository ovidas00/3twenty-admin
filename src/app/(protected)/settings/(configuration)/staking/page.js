"use client";

import { useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api"; // adjust your API import
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
        text: response.data.message || "Staking details updated successfully",
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
    setMessage(null); // reset message
    updateMutation.mutate();
  };

  return (
    <div className="bg-white p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
        {/* Duration Days */}
        <Input
          type="number"
          min="1"
          value={stakingDetails.durationDays}
          onChange={(e) =>
            handleChange("durationDays", parseInt(e.target.value) || 0)
          }
          size="sm"
          label="Duration Days"
        />
        {/* APY */}
        <Input
          type="number"
          step="0.01"
          min="0"
          value={stakingDetails.apy}
          onChange={(e) => handleChange("apy", parseFloat(e.target.value) || 0)}
          size="sm"
          label="APY (%)"
        />
        {/* Minimum Stake */}
        <Input
          type="number"
          step="0.01"
          min="0"
          value={stakingDetails.minimum}
          onChange={(e) =>
            handleChange("minimum", parseFloat(e.target.value) || 0)
          }
          size="sm"
          label="Minimum Stake"
        />
        {/* Maximum Stake */}
        <Input
          type="number"
          step="0.01"
          min="0"
          value={stakingDetails.maximum}
          onChange={(e) =>
            handleChange("maximum", parseFloat(e.target.value) || 0)
          }
          size="sm"
          label="Maximun Stake"
        />
        {/* Update Button */}
        <div className="col-span-full flex justify-start mt-4">
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

export default StakingPage;
