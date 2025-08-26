"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Edit, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

const PhasesPage = () => {
  const { data } = useQuery({
    queryKey: ["phases"],
    queryFn: async () => {
      const response = await api.get("/phases");
      return response.data.payload.phases;
    },
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Table Card */}
        <div className="bg-white overflow-hidden">
          {/* Card Header */}
          <div className="flex justify-between items-start gap-4 px-4 py-4 md:px-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Phases
            </h2>
            <Button>
              <Plus className="w-5 h-5" />
              Add Phase
            </Button>
          </div>

          {/* Single Table View (for all screens) */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supply
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data && data.length > 0 ? (
                  data.map((phase) => (
                    <tr key={phase.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {phase.name}
                          </span>
                          {phase.isActive && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(phase.start)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(phase.end)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {phase.supply.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(phase.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          className="hover:bg-gray-100"
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          No phases found
                        </div>
                        <p className="text-sm text-gray-500">
                          Get started by adding your first phase
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhasesPage;
