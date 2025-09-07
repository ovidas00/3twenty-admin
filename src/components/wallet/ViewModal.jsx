"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  User,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ViewModal = ({ isOpen, onClose, selectedTransaction }) => {
  const queryClient = useQueryClient();

  // Mutation for marking transaction completed
  const markCompletedMutation = useMutation({
    mutationFn: (id) => api.post(`/wallet/${id}/complete`),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Transaction marked completed");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to mark completed");
    },
  });

  if (!selectedTransaction) return null;

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

  const infoItem = (icon, label, value, valueClass = "") => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-6 h-6 flex items-center justify-center text-blue-500 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </div>
        <div
          className={`text-sm font-semibold text-gray-800 break-all ${valueClass}`}
        >
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
    >
      <div className="flex flex-col lg:flex-row gap-6 p-2">
        {/* Left Column */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-3">
            {infoItem(
              <Hash className="w-5 h-5" />,
              "Transaction ID",
              selectedTransaction.id
            )}
            {infoItem(
              <User className="w-5 h-5" />,
              "User",
              `${selectedTransaction.user?.name} (${selectedTransaction.user?.email})`
            )}
            {infoItem(
              selectedTransaction.transactionType === "Deposit" ? (
                <ArrowDownCircle className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-red-500" />
              ),
              "Transaction Type",
              selectedTransaction.transactionType
            )}
            {infoItem(
              <DollarSign className="w-5 h-5" />,
              "Amount",
              `${selectedTransaction.amount}`
            )}
            {infoItem(
              <ArrowUpCircle className="w-5 h-5" />,
              "From",
              selectedTransaction.from || "N/A"
            )}
            {infoItem(
              <ArrowDownCircle className="w-5 h-5" />,
              "To",
              selectedTransaction.to || "N/A"
            )}
            {infoItem(
              <FileText className="w-5 h-5" />,
              "Note",
              selectedTransaction.note || "No Note"
            )}
            {infoItem(
              selectedTransaction.status === "Completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              ),
              "Status",
              selectedTransaction.status
            )}
            {infoItem(
              <Calendar className="w-5 h-5" />,
              "Created At",
              formatDate(selectedTransaction.createdAt)
            )}
            {infoItem(
              <Calendar className="w-5 h-5" />,
              "Last Updated",
              formatDate(selectedTransaction.updatedAt)
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:w-2/5 xl:w-1/3 flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              Transaction Actions
            </h3>

            <div className="space-y-3">
              {/* View on Explorer */}
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  window.open(
                    `https://bscscan.com/tx/${selectedTransaction.from}`,
                    "_blank"
                  );
                }}
                disabled={!selectedTransaction.from}
              >
                <Hash className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>

              {/* Mark Completed with SweetAlert */}
              {selectedTransaction.status !== "Completed" && (
                <Button
                  variant="success"
                  size="md"
                  className="w-full justify-center py-3 disabled:opacity-50"
                  disabled={markCompletedMutation.isPending}
                  onClick={async () => {
                    onClose();

                    const result = await Swal.fire({
                      title: "Mark Transaction as Completed?",
                      text: "This action will set the transaction status to completed.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Yes, Mark Completed",
                      cancelButtonText: "Cancel",
                      reverseButtons: true,
                      confirmButtonColor: "#10B981",
                    });

                    if (result.isConfirmed) {
                      markCompletedMutation.mutate(selectedTransaction.id);
                    }
                  }}
                >
                  {markCompletedMutation.isPending ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Completed
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;
