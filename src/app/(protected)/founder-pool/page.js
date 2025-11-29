"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Filter, FileText, File, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FounderPoolPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("all");
  const [appliedParams, setAppliedParams] = useState("");

  // Fetch founder pools
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["founderPools", appliedParams],
    queryFn: async () => {
      const response = await api.get(`/founder-pool?${appliedParams}`);
      return response.data.payload;
    },
  });

  // Sync URL params with state on load
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());
    setStatus(urlParams.get("status") || "all");
    setAppliedParams(urlParams.toString());
  }, [searchParams]);

  // Build query string from filters
  const buildParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    status !== "all" ? params.set("status", status) : params.delete("status");
    params.delete("page"); // reset page when filtering
    return params.toString();
  };

  const handleSearch = () => {
    const params = buildParams();
    setAppliedParams(params);
    router.push(`${window.location.pathname}?${params}`);
    refetch();
  };

  const handleReset = () => {
    setStatus("all");
    setAppliedParams("");
    router.push(window.location.pathname);
    refetch();
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/founder-pool/${id}/approve`),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["founderPools"] });
    },
    onError: (error) => toast.error(error.response?.data?.message),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.post(`/founder-pool/${id}/reject`),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["founderPools"] });
    },
    onError: (error) => toast.error(error.response?.data?.message),
  });

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header with Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Founder Pool Applications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage and review founder pool applications
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                ]}
                size="sm"
              />

              <div className="flex flex-row gap-2">
                <Button
                  onClick={handleSearch}
                  variant="dark"
                  icon={<Filter className="w-4 h-4" />}
                  size="sm"
                  className="flex-1"
                >
                  Apply
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {`Father's`} Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passport/NID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 8 }).map((_, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.founderPools && data.founderPools.length > 0 ? (
                  data.founderPools.map((fp) => (
                    <tr
                      key={fp.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {fp["user.name"]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {fp["user.email"]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {fp.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {fp.mobileNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {fp.fathersName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {fp.nidPassportNumber}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
        ${
          fp.status === "Approved"
            ? "bg-green-100 text-green-800"
            : fp.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
                        >
                          {fp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 text-right">
                        {formatDate(fp.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            title="View Info"
                            className="hover:bg-gray-50"
                            size="sm"
                            icon={<FileText className="w-4 h-4" />}
                            onClick={() => window.open(fp.documentFile)}
                          >
                            Doc
                          </Button>

                          <Button
                            variant={
                              fp.status !== "Pending" ? "secondary" : "outline"
                            }
                            size="md"
                            icon={<CheckCircle className="w-4 h-4" />}
                            disabled={fp.status !== "Pending"}
                            onClick={async () => {
                              if (fp.status !== "Pending") return;
                              const result = await Swal.fire({
                                title: "Approve Founder Request?",
                                text: "This will update the user as founder and deduct investment.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, approve!",
                                cancelButtonText: "Cancel",
                                confirmButtonColor: "#10B981",
                                reverseButtons: true,
                              });
                              if (result.isConfirmed) {
                                approveMutation.mutate(fp.id);
                              }
                            }}
                          ></Button>

                          <Button
                            variant={
                              fp.status !== "Pending" ? "secondary" : "outline"
                            }
                            size="md"
                            icon={<XCircle className="w-4 h-4" />}
                            disabled={fp.status !== "Pending"}
                            onClick={async () => {
                              if (fp.status !== "Pending") return;
                              const result = await Swal.fire({
                                title: "Reject Founder Request?",
                                text: "This will update the user as founder status and refund investment.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, reject!",
                                cancelButtonText: "Cancel",
                                confirmButtonColor: "#f84c4cff",
                                reverseButtons: true,
                              });
                              if (result.isConfirmed) {
                                rejectMutation.mutate(fp.id);
                              }
                            }}
                          ></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FileText className="w-16 h-16 text-gray-300" />
                        <div className="text-lg font-medium text-gray-500">
                          No applications found
                        </div>
                        <p className="text-sm text-gray-400">
                          Try adjusting your filter
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-medium">{data.currentPage}</span>{" "}
                of <span className="font-medium">{data.totalPages}</span> pages
                • <span className="font-medium">{data.totalItems}</span> total
                applications
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    data.currentPage > 1 &&
                    handlePageChange(data.currentPage - 1)
                  }
                  disabled={data.currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, data.totalPages) },
                    (_, index) => {
                      const page = index + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            data.currentPage === page ? "dark" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                  {data.totalPages > 5 && (
                    <span className="px-2 text-sm text-gray-500">...</span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    data.currentPage < data.totalPages &&
                    handlePageChange(data.currentPage + 1)
                  }
                  disabled={data.currentPage === data.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FounderPoolPage;
