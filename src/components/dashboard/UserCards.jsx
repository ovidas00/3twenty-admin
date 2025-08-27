"use client";

import { Users, UserCheck, UserX, Activity } from "lucide-react";

const UserCards = () => {
  const cards = [
    {
      title: "Total Users",
      value: "1,250",
      icon: <Users className="w-6 h-6 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: "980",
      icon: <UserCheck className="w-6 h-6 text-white" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Inactive Users",
      value: "270",
      icon: <UserX className="w-6 h-6 text-white" />,
      bgColor: "bg-red-500",
    },
    {
      title: "Activation Ratio",
      value: "78%",
      icon: <Activity className="w-6 h-6 text-white" />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          User Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 transition-shadow bg-white"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${card.bgColor} flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
