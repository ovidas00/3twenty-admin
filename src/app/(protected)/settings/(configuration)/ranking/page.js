"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfigContext } from "../layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Settings, Award, Save, Crown, Star, Target } from "lucide-react";
import { Coins } from "lucide-react";

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
        value: formData,
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
        text:
          error.response?.data?.message || "Failed to update ranking settings",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case "1":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "2":
        return <Star className="w-4 h-4 text-blue-600" />;
      case "3":
        return <Target className="w-4 h-4 text-green-600" />;
      default:
        return <Award className="w-4 h-4 text-purple-600" />;
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
              Ranking System
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure reward percentages for different ranking levels
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
            {Object.entries(formData).map(([rank, value]) => (
              <div key={rank} className="space-y-3">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={value}
                  label={`Rank ${rank}`}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [rank]: e.target.value,
                    }))
                  }
                  placeholder="0.0"
                  size="sm"
                  required={true}
                  icon={() => (
                    <span className="text-gray-400">
                      <Coins className="w-4 h-4" />
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

export default RankingPage;
