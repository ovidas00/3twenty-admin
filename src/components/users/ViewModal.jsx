"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  User,
  AtSign,
  Gift,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Lock,
  Unlock,
  Coins,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ViewModal = ({ isOpen, onClose, selectedUser }) => {
  if (!selectedUser) return null;

  const router = useRouter();
  const queryClient = useQueryClient();

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
    <div className="flex items-center gap-2 p-2">
      <div className="w-6 h-6 flex items-center justify-center text-gray-500">
        {icon}
      </div>
      <div className="flex-1 text-gray-700">
        <div className="text-sm font-medium">{label}</div>
        <div className={`text-base font-semibold ${valueClass}`}>{value}</div>
      </div>
    </div>
  );

  const toggleMutation = useMutation({
    mutationFn: (id) => api.post(`/users/${id}/toggle-block`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.data.message);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Information" size="lg">
      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {infoItem(<User className="w-5 h-5" />, "Name", selectedUser.name)}
        {infoItem(<AtSign className="w-5 h-5" />, "Email", selectedUser.email)}
        {infoItem(
          <Gift className="w-5 h-5" />,
          "Referral Code",
          selectedUser.referralCode
        )}
        {infoItem(
          <User className="w-5 h-5" />,
          "Referrer",
          selectedUser.referrer?.name || "-"
        )}
        {infoItem(
          <DollarSign className="w-5 h-5" />,
          "Token",
          selectedUser.token
        )}
        {infoItem(
          <DollarSign className="w-5 h-5" />,
          "USDT",
          selectedUser.usdt
        )}
        {infoItem(
          selectedUser.isActive ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          ),
          "Status",
          `${selectedUser.isActive ? "Active" : "Inactive"} / ${
            selectedUser.isBlocked ? "Blocked" : "Unblocked"
          }`
        )}
        {infoItem(
          <User className="w-5 h-5" />,
          "Rank",
          selectedUser.rank || "-"
        )}
        {infoItem(
          <Calendar className="w-5 h-5" />,
          "Joining Date",
          formatDate(selectedUser.createdAt)
        )}
        {infoItem(
          <Calendar className="w-5 h-5" />,
          "Last Updated",
          formatDate(selectedUser.updatedAt)
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-6 p-4 border-t border-gray-200 gap-2">
        {/* Left Group: View Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              onClose();
              router.push(`/transactions?userId=${selectedUser.id}`);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Transactions
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              onClose();
              router.push(`/stakings?userId=${selectedUser.id}`);
            }}
          >
            <Coins className="w-4 h-4 mr-2" />
            View Stakings
          </Button>
        </div>

        {/* Right: Block/Unblock Button */}
        <Button
          variant={selectedUser.isBlocked ? "success" : "danger"}
          size="md"
          className="mt-2 md:mt-0" // margin-top for stacked layout on mobile
          onClick={async () => {
            onClose();

            const result = await Swal.fire({
              title: selectedUser.isBlocked ? "Unblock User?" : "Block User?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: selectedUser.isBlocked
                ? "Yes, Unblock"
                : "Yes, Block",
              cancelButtonText: "Cancel",
              reverseButtons: true,
              confirmButtonColor: selectedUser.isBlocked
                ? "#10B981"
                : "#EF4444",
            });

            if (result.isConfirmed) {
              toggleMutation.mutate(selectedUser.id);
            }
          }}
        >
          {selectedUser.isBlocked ? (
            <>
              <Unlock className="w-4 h-4 mr-2" />
              Unblock User
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Block User
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ViewModal;
