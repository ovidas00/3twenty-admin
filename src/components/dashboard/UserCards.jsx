"use client";

import { Users, UserCheck, UserX, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const UserCards = () => {
  const { data: userStats } = useQuery({
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
      icon: <Users className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: new Intl.NumberFormat().format(userStats?.active ?? 0),
      icon: <UserCheck className="w-5 h-5 text-white" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Inactive Users",
      value: new Intl.NumberFormat().format(userStats?.inactive ?? 0),
      icon: <UserX className="w-5 h-5 text-white" />,
      bgColor: "bg-red-500",
    },
    {
      title: "Activation Ratio",
      value: `${userStats?.activationRatio ?? 0}%`,
      icon: <Activity className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700">
          User Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex items-center p-4 rounded-lg border border-gray-200 bg-white"
          >
            <div
              className={`p-3 rounded-lg ${card.bgColor} flex items-center justify-center mr-4`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">
                {card.title}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
