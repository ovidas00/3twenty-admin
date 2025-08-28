"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Calendar, Clock } from "lucide-react";

const FinanceOverview = () => {
  const { data: finantialStats } = useQuery({
    queryKey: ["finantialstats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/finantial-stats");
      return response.data.payload;
    },
  });

  const depositStats = {
    total: finantialStats?.deposit?.total,
    today: finantialStats?.deposit?.today,
    last7Days: finantialStats?.deposit?.last7Days,
    last30Days: finantialStats?.deposit?.last30Days,
  };

  const withdrawStats = {
    total: finantialStats?.withdraw?.total,
    today: finantialStats?.withdraw?.today,
    last7Days: finantialStats?.withdraw?.last7Days,
    last30Days: finantialStats?.withdraw?.last30Days,
  };

  const metricItem = (icon, label, value, iconColor) => (
    <div className="flex justify-between items-center py-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconColor} text-white`}>{icon}</div>
        <p className="text-gray-700 font-medium">{label}</p>
      </div>
      <p className="font-semibold text-gray-900">
        ${new Intl.NumberFormat().format(value)}
      </p>
    </div>
  );

  const statsCard = (title, stats, type) => {
    const arrowIcon =
      type === "Deposit" ? (
        <ArrowDown className="w-5 h-5" />
      ) : (
        <ArrowUp className="w-5 h-5" />
      );
    const arrowColor = type === "Deposit" ? "bg-green-500" : "bg-red-500";

    return (
      <div className="bg-white rounded-xl shadow duration-200 p-6 divide-y divide-gray-100">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{title}</h2>
        {metricItem(arrowIcon, `${type} Total`, stats.total, arrowColor)}
        {metricItem(
          <Clock className="w-5 h-5" />,
          "Today",
          stats.today,
          "bg-blue-500"
        )}
        {metricItem(
          <Calendar className="w-5 h-5" />,
          "Last 7 Days",
          stats.last7Days,
          "bg-yellow-500"
        )}
        {metricItem(
          <Calendar className="w-5 h-5" />,
          "Last 30 Days",
          stats.last30Days,
          "bg-pink-500"
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {statsCard("Deposit Overview", depositStats, "Deposit")}
      {statsCard("Withdraw Overview", withdrawStats, "Withdraw")}
    </div>
  );
};

export default FinanceOverview;
