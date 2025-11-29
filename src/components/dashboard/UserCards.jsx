"use client";

import { Users, UserCheck, UserX, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const UserCards = () => {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ["userstats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/user-stats");
      return response.data.payload.userStats;
    },
  });

  const cards = [
    {
      title: "Total Users",
      value: new Intl.NumberFormat().format(userStats?.total ?? 0),
      icon: <Users className="w-5 h-5" />,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Active Users",
      value: new Intl.NumberFormat().format(userStats?.active ?? 0),
      icon: <UserCheck className="w-5 h-5" />,
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      title: "Inactive Users",
      value: new Intl.NumberFormat().format(userStats?.inactive ?? 0),
      icon: <UserX className="w-5 h-5" />,
      bgColor: "bg-red-500/10",
      iconColor: "text-red-600",
      borderColor: "border-l-red-500",
    },
    {
      title: "Activation Ratio",
      value: `${userStats?.activationRatio ?? 0}%`,
      icon: <Activity className="w-5 h-5" />,
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
      borderColor: "border-l-purple-500",
    },
  ];

  return (
    <div className="bg-white p-6 border border-gray-200 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Key user metrics and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`flex items-start p-5 rounded-lg border border-gray-200 bg-white border-l-4 ${card.borderColor}`}
          >
            <div
              className={`p-3 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center mr-4`}
            >
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 truncate">
                {card.title}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 truncate">
                {isLoading ? (
                  <span className="inline-block h-8 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  card.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
