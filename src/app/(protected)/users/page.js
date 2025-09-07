"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Users, Search, Filter, Eye, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ViewModal from "@/components/users/ViewModal";
import WalletModal from "@/components/users/WalletModal";

const UsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // local state for filter inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userStatus, setUserStatus] = useState("all");

  // params used for fetching
  const [appliedParams, setAppliedParams] = useState("");

  // fetch users with applied params
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users", appliedParams],
    queryFn: async () => {
      const response = await api.get(`/users?${appliedParams}`);
      return response.data.payload;
    },
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

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        user={selectedUser}
      />

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header with Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Users Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and monitor user accounts
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Input
                  id="search"
                  name="search"
                  type="text"
                  icon={Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email"
                  className="w-full sm:w-64"
                  size="sm"
                />

                <div className="flex flex-row gap-2">
                  <div className="flex-1">
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
                  </div>

                  <div className="flex-1">
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
                  </div>
                </div>

                <div className="flex flex-row gap-2">
                  <Button
                    onClick={handleSearch}
                    variant="dark"
                    className="flex-1"
                    icon={<Filter className="w-4 h-4" />}
                    size="sm"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                    size="sm"
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
                      Status
                    </th>
                    {/* <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th> */}
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data?.users && data.users.length > 0 ? (
                    data.users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {user.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.referrer?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium text-center">
                          {new Intl.NumberFormat().format(user.token)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                          {formatCurrency(parseFloat(user.usdt))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 text-center">
                          {formatDate(user.createdAt)}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              title="View Info"
                              className="hover:bg-gray-50"
                              size="sm"
                              icon={<Eye className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedUser(user);
                                setIsViewModalOpen(true);
                              }}
                            >
                              View
                            </Button>

                            <Button
                              variant="outline"
                              title="Manage Wallet"
                              className="hover:bg-gray-50"
                              size="sm"
                              icon={<Wallet className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedUser(user);
                                setIsWalletModalOpen(true);
                              }}
                            ></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Users className="w-16 h-16 text-gray-300" />
                          <div className="text-lg font-medium text-gray-500">
                            No users found
                          </div>
                          <p className="text-sm text-gray-400">
                            Try adjusting your search or filters
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
                  Showing{" "}
                  <span className="font-medium">{data.currentPage}</span> of{" "}
                  <span className="font-medium">{data.totalPages}</span> pages •{" "}
                  <span className="font-medium">{data.totalItems}</span> total
                  users
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
    </>
  );
};

export default UsersPage;
