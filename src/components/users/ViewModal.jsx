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
} from "lucide-react";

const ViewModal = ({ isOpen, onClose, selectedUser }) => {
  if (!selectedUser) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Information" size="lg">
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

      <div className="flex justify-end mt-6">
        <Button variant="dark" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ViewModal;
