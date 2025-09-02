"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Search, Filter, CreditCard } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";

const TransactionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [status, setStatus] = useState("all");

  const [appliedParams, setAppliedParams] = useState("");

  // Fetch transactions
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["transactions", appliedParams],
    queryFn: async () => {
      const response = await api.get(`/transactions?${appliedParams}`);
      return response.data.payload;
    },
  });

  // Sync URL params with state on load
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());
    setDateFrom(urlParams.get("dateFrom") || "");
    setDateTo(urlParams.get("dateTo") || "");
    setTransactionType(urlParams.get("transactionType") || "all");
    setCurrency(urlParams.get("currency") || "all");
    setStatus(urlParams.get("status") || "all");

    setAppliedParams(urlParams.toString());
  }, [searchParams]);

  // Build query string from filters
  const buildParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    dateFrom ? params.set("dateFrom", dateFrom) : params.delete("dateFrom");
    dateTo ? params.set("dateTo", dateTo) : params.delete("dateTo");
    transactionType !== "all"
      ? params.set("transactionType", transactionType)
      : params.delete("transactionType");
    currency !== "all"
      ? params.set("currency", currency)
      : params.delete("currency");
    status !== "all" ? params.set("status", status) : params.delete("status");

    params.delete("page"); // reset page on filter
    return params.toString();
  };

  const handleSearch = () => {
    const params = buildParams();
    setAppliedParams(params);
    router.push(`${window.location.pathname}?${params}`);
    refetch();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setTransactionType("all");
    setCurrency("all");
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

  const formatCurrency = (amount, currency) => {
    if (currency === "USDT") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(amount);
    }
    return `${amount} ${currency}`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header with Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Transactions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View and filter transactions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
                size="sm"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
                size="sm"
              />
              <Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Referral", label: "Referral" },
                  { value: "Staking", label: "Staking" },
                  { value: "Purchase", label: "Purchase" },
                  { value: "Bonus", label: "Bonus" },
                  { value: "Activation", label: "Activation" },
                  { value: "Rank", label: "Rank" },
                  { value: "Refund", label: "Refund" },
                ]}
                size="sm"
              />
              {/* <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: "all", label: "All Currencies" },
                  { value: "USDT", label: "USDT" },
                  { value: "3TWENTY", label: "3TWENTY" },
                ]}
                size="sm"
              />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "Completed", label: "Completed" },
                  { value: "Pending", label: "Pending" },
                  { value: "Failed", label: "Failed" },
                ]}
                size="sm"
              /> */}

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
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date and Time
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
                ) : data?.transactions && data.transactions.length > 0 ? (
                  data.transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.user?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.transactionType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-center">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.currency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.status}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 text-right">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <CreditCard className="w-16 h-16 text-gray-300" />
                        <div className="text-lg font-medium text-gray-500">
                          No transactions found
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

export default TransactionsPage;
