"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Users, Search, Filter, Eye, Ban } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ViewModal from "@/components/users/ViewModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const UsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // local state for filter inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userStatus, setUserStatus] = useState("all");

  // params used for fetching
  const [appliedParams, setAppliedParams] = useState("");

  // fetch users with applied params
  const { data, refetch } = useQuery({
    queryKey: ["users", appliedParams],
    queryFn: async () => {
      const response = await api.get(`/users?${appliedParams}`);
      return response.data.payload;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.post(`/users/${id}/toggle-block`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.data.message);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  // Sync filters + applied params with URL on load and on URL change
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());

    const initialSearch = urlParams.get("search") || "";
    const initialStatus = urlParams.get("status") || "all";
    const initialUserStatus = urlParams.get("userStatus") || "all";

    setSearchTerm(initialSearch);
    setStatusFilter(initialStatus);
    setUserStatus(initialUserStatus);

    setAppliedParams(urlParams.toString());
  }, [searchParams]);

  // build query string from current filters
  const buildParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");

    if (statusFilter !== "all") params.set("status", statusFilter);
    else params.delete("status");

    if (userStatus !== "all") params.set("userStatus", userStatus);
    else params.delete("userStatus");

    params.delete("page"); // reset page on new filter
    return params.toString();
  };

  // Apply button
  const handleSearch = () => {
    const params = buildParams();
    setAppliedParams(params);
    router.push(`${window.location.pathname}?${params}`);
    refetch();
  };

  // Reset button
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setUserStatus("all");
    setAppliedParams("");
    router.push(window.location.pathname);
    refetch();
  };

  // handle pagination
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
        })
      : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <>
      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedUser={selectedUser}
      />

      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 py-5 md:px-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Users List
              </h2>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto items-stretch md:items-center">
                <Input
                  id="search"
                  name="search"
                  type="text"
                  icon={Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email"
                  className="w-full md:w-64"
                  size="sm"
                />

                <Select
                  id="status"
                  name="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Accounts" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  size="sm"
                />

                <Select
                  id="userStatus"
                  name="userStatus"
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                  options={[
                    { value: "all", label: "All Users" },
                    { value: "active", label: "Active" },
                    { value: "blocked", label: "Blocked" },
                  ]}
                  size="sm"
                />

                <div className="flex flex-row gap-2 w-full md:w-auto">
                  <Button
                    onClick={handleSearch}
                    variant="dark"
                    className="flex-1 md:flex-none"
                    icon={<Filter className="w-4 h-4" />}
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 md:flex-none"
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
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USDT
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data?.users && data.users.length > 0 ? (
                    data.users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 text-center font-semibold whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-center whitespace-nowrap font-semibold text-gray-900">
                            {user.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.referrer?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {user.token}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {formatCurrency(parseFloat(user.usdt))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                          {/* View Button */}
                          <Button
                            variant="outline"
                            className="hover:bg-gray-100 font-semibold"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewModalOpen(true);
                            }}
                          >
                            View
                          </Button>

                          {/* Block/Unblock Icon Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2 hover:opacity-80"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: user.isBlocked
                                  ? "Unblock User?"
                                  : "Block User?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: user.isBlocked
                                  ? "Yes, Unblock"
                                  : "Yes, Block",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                              });

                              if (result.isConfirmed) {
                                toggleMutation.mutate(user.id);
                              }
                            }}
                            icon={
                              <Ban
                                className={`w-4 h-4 ${
                                  user.isBlocked
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              />
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <div className="text-lg font-medium text-gray-600">
                            No users found
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Inline Pagination */}
            {data?.totalPages > 0 && (
              <div className="flex items-center justify-between overflow-x-auto p-4 rounded-bl-lg rounded-br-lg">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">{data.currentPage}</span> to{" "}
                  <span className="font-medium">{data.totalPages}</span> of{" "}
                  <span className="font-medium">{data.totalItems}</span> results
                </div>

                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      data.currentPage > 1 &&
                      handlePageChange(data.currentPage - 1)
                    }
                  >
                    Previous
                  </button>

                  {Array.from({ length: data.totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        data.currentPage !== index + 1 &&
                        handlePageChange(index + 1)
                      }
                      className={`px-3 py-1 cursor-pointer rounded-md border text-sm font-medium ${
                        data.currentPage === index + 1
                          ? "bg-blue-50 text-blue-600 border-blue-300"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      data.currentPage < data.totalPages &&
                      handlePageChange(data.currentPage + 1)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
