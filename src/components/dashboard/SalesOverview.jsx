"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SalesDashboard = () => {
  const { data: salesStats } = useQuery({
    queryKey: ["salesstate"],
    queryFn: async () => {
      const response = await api.get("/dashboard/sale-stats");
      return response.data.payload.saleStats;
    },
  });

  const { data: runningSalesStats } = useQuery({
    queryKey: ["runningsalestate"],
    queryFn: async () => {
      const response = await api.get("/dashboard/running-sale-stats");
      return response.data.payload.runningSaleStas;
    },
  });

  // Pie only shows Sold vs Remaining
  const pieData = [
    { name: "Sold 3Twenty", value: runningSalesStats?.total3TWENTY ?? 0 },
    { name: "Remaining", value: runningSalesStats?.totalAvailable ?? 0 },
  ];

  const COLORS = ["#10B981", "#3B82F6"]; // green sold, blue remaining

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Sales Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-xl p-4 flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-gray-500">
                Total Supply (3Twenty)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat().format(salesStats?.totalSupply ?? 0)}
              </p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-gray-500">
                Total Sold (3Twenty)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat().format(salesStats?.total3TWENTY ?? 0)}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-gray-500">
                Total Sold (USDT)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                ${new Intl.NumberFormat().format(salesStats?.totalUSDT ?? 0)}
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-gray-500">Sales Growth</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {salesStats?.salesGrowth ?? 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Active Phase Overview */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Active Phase Overview
          </h2>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
              <div className="bg-indigo-50 rounded-xl p-4 flex flex-col items-start justify-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Supply (3Twenty)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {new Intl.NumberFormat().format(
                    runningSalesStats?.totalSupply ?? 0
                  )}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 flex flex-col items-start justify-center">
                <p className="text-sm font-medium text-gray-500">
                  Sales Growth
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {runningSalesStats?.salesGrowth ?? 0}%
                </p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-start justify-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Sold (USDT)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  $
                  {new Intl.NumberFormat().format(
                    runningSalesStats?.totalUSDT ?? 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
