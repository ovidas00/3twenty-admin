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

const PhasesPage = () => {
  const queryClient = useQueryClient();
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
        <div className="max-w-6xl mx-auto">
          {/* Table Card */}
          <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="flex justify-between items-start gap-4 px-4 py-4 md:px-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Phases
              </h2>
              <Button
                className="font-semibold"
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data && data.length > 0 ? (
                    data.map((phase) => (
                      <tr key={phase.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {phase.name}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(phase.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              phase.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {phase.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(phase.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex gap-3 justify-end">
                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            className="hover:bg-gray-100 font-semibold"
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
                            size="sm"
                            icon={<CheckCircle className="w-4 h-4 me-0" />}
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
                              });
                              if (result.isConfirmed) {
                                activeMutation.mutate(phase.id);
                              }
                            }}
                          ></Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <div className="text-gray-400">
                            <Layers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          </div>
                          <div className="text-lg font-medium text-gray-600">
                            No phases found
                          </div>
                          <p className="text-sm text-gray-500">
                            Get started by adding a first phase
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
    </>
  );
};

export default PhasesPage;
