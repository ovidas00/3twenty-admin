"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Edit, Plus, Layers, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import AddModal from "@/components/phases/AddModal";
import UpdateModal from "@/components/phases/UpdateModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Settings } from "lucide-react";

const PhasesPage = () => {
  const queryClient = useQueryClient();
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
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
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const activeMutation = useMutation({
    mutationFn: (id) => api.post(`/phases/${id}/activate`),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["phases"] });
    },
    onError: (error) => toast.error(error.response?.data?.message),
  });

  return (
    <>
      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedPhase={selectedPhase}
      />

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Phases Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage token sale phases and pricing
                </p>
              </div>
              <Button
                className="font-semibold w-full md:w-auto"
                variant="dark"
                onClick={() => setIsAddModalOpen(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Phase
              </Button>
            </div>

            {/* Table */}
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
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supply
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data && data.length > 0 ? (
                    data.map((phase) => (
                      <tr
                        key={phase.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {phase.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(phase.start)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(phase.end)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {phase.supply.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(phase.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              phase.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {phase.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(phase.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Button */}
                            <Button
                              variant="outline"
                              className="hover:bg-gray-50"
                              size="sm"
                              icon={<Edit className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedPhase(phase);
                                setIsUpdateModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>

                            {/* Activate Button */}
                            <Button
                              variant={phase.isActive ? "secondary" : "outline"}
                              size="md"
                              icon={<Settings className="w-4 h-4" />}
                              disabled={phase.isActive}
                              onClick={async () => {
                                if (phase.isActive) return;
                                const result = await Swal.fire({
                                  title: "Activate Phase?",
                                  text: "This will update token price and supply.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, activate it!",
                                  cancelButtonText: "Cancel",
                                  confirmButtonColor: "#10B981",
                                  reverseButtons: true,
                                });
                                if (result.isConfirmed) {
                                  activeMutation.mutate(phase.id);
                                }
                              }}
                            ></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Layers className="w-16 h-16 text-gray-300" />
                          <div className="text-lg font-medium text-gray-500">
                            No phases found
                          </div>
                          <p className="text-sm text-gray-400">
                            Get started by adding your first phase
                          </p>
                          <Button
                            variant="dark"
                            onClick={() => setIsAddModalOpen(true)}
                            icon={<Plus className="w-4 h-4" />}
                            size="sm"
                          >
                            Add Phase
                          </Button>
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
    </>
  );
};

export default PhasesPage;
