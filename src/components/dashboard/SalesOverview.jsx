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
  const { data: salesStats, isLoading: salesLoading } = useQuery({
    queryKey: ["salesstate"],
    queryFn: async () => {
      const response = await api.get("/dashboard/sale-stats");
      return response.data.payload.saleStats;
    },
  });

  const { data: runningSalesStats, isLoading: runningSalesLoading } = useQuery({
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Sales Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Supply (3Twenty)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <span className="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  new Intl.NumberFormat().format(salesStats?.totalSupply ?? 0)
                )}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Sold (3Twenty)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <span className="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  new Intl.NumberFormat().format(salesStats?.total3TWENTY ?? 0)
                )}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Sold (USDT)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <span className="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  `$${new Intl.NumberFormat().format(
                    salesStats?.totalUSDT ?? 0
                  )}`
                )}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Sales Growth
              </p>
              <p className="text-xl font-bold text-gray-900">
                {salesLoading ? (
                  <span className="inline-block h-7 w-12 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  `${salesStats?.salesGrowth ?? 0}%`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Active Phase Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
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
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat().format(Number(value))
                    }
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics */}
            <div className="flex-1 grid grid-cols-1 gap-4 w-full">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Supply (3Twenty)
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {runningSalesLoading ? (
                    <span className="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    new Intl.NumberFormat().format(
                      runningSalesStats?.totalSupply ?? 0
                    )
                  )}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Sales Growth
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {runningSalesLoading ? (
                    <span className="inline-block h-7 w-12 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    `${runningSalesStats?.salesGrowth ?? 0}%`
                  )}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Sold (USDT)
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {runningSalesLoading ? (
                    <span className="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    `$${new Intl.NumberFormat().format(
                      runningSalesStats?.totalUSDT ?? 0
                    )}`
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
