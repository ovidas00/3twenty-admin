"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Filter, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Wallet, Eye } from "lucide-react";
import ViewModal from "@/components/wallet/ViewModal";

const WalletPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [appliedParams, setAppliedParams] = useState("");

  // Fetch wallet histories
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["walletHistories", appliedParams],
    queryFn: async () => {
      const response = await api.get(`/wallet?${appliedParams}`);
      return response.data.payload;
    },
  });

  // Sync filters from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    setDateFrom(params.get("dateFrom") || "");
    setDateTo(params.get("dateTo") || "");
    setStatusFilter(params.get("status") || "all");
    setTransactionType(params.get("transactionType") || "all");

    setAppliedParams(params.toString());
  }, [searchParams]);

  const buildParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    dateFrom ? params.set("dateFrom", dateFrom) : params.delete("dateFrom");
    dateTo ? params.set("dateTo", dateTo) : params.delete("dateTo");
    statusFilter !== "all"
      ? params.set("status", statusFilter)
      : params.delete("status");
    transactionType !== "all"
      ? params.set("transactionType", transactionType)
      : params.delete("transactionType");

    params.delete("page"); // reset page on filter
    return params.toString();
  };

  const handleApply = () => {
    const params = buildParams();
    setAppliedParams(params);
    router.push(`${window.location.pathname}?${params}`);
    refetch();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
    setTransactionType("all");
    setAppliedParams("");
    router.push(window.location.pathname);
    refetch();
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const formatDateTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "N/A";

  return (
    <>
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedTransaction={selectedTransaction}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Wallet Histories
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View and manage wallet transactions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                size="sm"
              />
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                size="sm"
              />

              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Completed", label: "Completed" },
                  { value: "Pending", label: "Pending" },
                ]}
                size="sm"
              />

              <Select
                id="transactionType"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Deposit", label: "Deposit" },
                  { value: "Withdrawal", label: "Withdrawal" },
                ]}
                size="sm"
              />

              <div className="flex flex-row gap-2">
                <Button
                  variant="dark"
                  onClick={handleApply}
                  size="sm"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Apply
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm">
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
                    Transaction Type
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
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
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.histories && data.histories.length > 0 ? (
                  data.histories.map((history) => (
                    <tr
                      key={history.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {history.user?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {history.user?.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {history.transactionType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {parseFloat(history.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
      ${
        history.status === "Completed"
          ? "bg-green-100 text-green-800"
          : tx.status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800"
      }`}
                        >
                          {history.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right whitespace-nowrap">
                        {formatDateTime(history.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            title="View Info"
                            className="hover:bg-gray-50"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => {
                              setSelectedTransaction(history);
                              setIsViewModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Wallet className="w-16 h-16 text-gray-300" />
                        <div className="text-lg font-medium text-gray-500">
                          No history found
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
                Showing <span className="font-medium">{data.currentPage}</span>{" "}
                of <span className="font-medium">{data.totalPages}</span> pages
                • <span className="font-medium">{data.totalItems}</span> total
                transactions
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

                {Array.from(
                  { length: Math.min(5, data.totalPages) },
                  (_, index) => {
                    const page = index + 1;
                    return (
                      <Button
                        key={page}
                        variant={data.currentPage === page ? "dark" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  }
                )}

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
    </>
  );
};

export default WalletPage;
