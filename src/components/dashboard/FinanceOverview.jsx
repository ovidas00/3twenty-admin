"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Calendar, Clock } from "lucide-react";

const FinanceOverview = () => {
  const { data: finantialStats, isLoading } = useQuery({
    queryKey: ["finantialstats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/finantial-stats");
      return response.data.payload;
    },
  });

  const depositStats = {
    total: finantialStats?.deposit?.total ?? 0,
    today: finantialStats?.deposit?.today ?? 0,
    last7Days: finantialStats?.deposit?.last7Days ?? 0,
    last30Days: finantialStats?.deposit?.last30Days ?? 0,
  };

  const withdrawStats = {
    total: finantialStats?.withdraw?.total ?? 0,
    today: finantialStats?.withdraw?.today ?? 0,
    last7Days: finantialStats?.withdraw?.last7Days ?? 0,
    last30Days: finantialStats?.withdraw?.last30Days ?? 0,
  };

  const metricItem = (icon, label, value, iconColor, isLoading) => (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${iconColor} flex items-center justify-center`}
        >
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className="font-semibold text-gray-900 text-lg">
        {isLoading ? (
          <span className="inline-block h-6 w-20 bg-gray-200 rounded animate-pulse"></span>
        ) : (
          `$${new Intl.NumberFormat().format(value)}`
        )}
      </p>
    </div>
  );

  const statsCard = (title, stats, type) => {
    const arrowIcon =
      type === "Deposit" ? (
        <ArrowDown className="w-4 h-4 text-white" />
      ) : (
        <ArrowUp className="w-4 h-4 text-white" />
      );
    const arrowColor = type === "Deposit" ? "bg-green-500" : "bg-red-500";

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Financial transaction overview
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {metricItem(
            <div className={`p-1 rounded-full ${arrowColor}`}>{arrowIcon}</div>,
            `${type} Total`,
            stats.total,
            "bg-gray-100",
            isLoading
          )}
          {metricItem(
            <Clock className="w-4 h-4 text-blue-600" />,
            "Today",
            stats.today,
            "bg-blue-50",
            isLoading
          )}
          {metricItem(
            <Calendar className="w-4 h-4 text-yellow-600" />,
            "Last 7 Days",
            stats.last7Days,
            "bg-yellow-50",
            isLoading
          )}
          {metricItem(
            <Calendar className="w-4 h-4 text-purple-600" />,
            "Last 30 Days",
            stats.last30Days,
            "bg-purple-50",
            isLoading
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {statsCard("Deposit Overview", depositStats, "Deposit")}
      {statsCard("Withdraw Overview", withdrawStats, "Withdraw")}
    </div>
  );
};

export default FinanceOverview;
