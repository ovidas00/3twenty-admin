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
  Network,
  Phone,
  Wallet,
  MapPin,
  Crown,
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

  const formatDate = (dateStr, showTime = true) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          ...(showTime && { hour: "2-digit", minute: "2-digit" }),
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
        <div className={`text-sm font-semibold text-gray-800 ${valueClass}`}>
          {value}
        </div>
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

  const toggleVerified = useMutation({
    mutationFn: (id) => api.post(`/users/${id}/toggle-verify`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.data.message);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="flex flex-col lg:flex-row gap-6 p-2">
        {/* Left Column: User Information */}
        <div className="flex-1">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img
                src={selectedUser.profilePicture || "/default-avatar.png"}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full border shadow object-cover"
              />
              {selectedUser.isFounder ? (
                <Crown className="w-6 h-6 p-1 absolute -right-1 bottom-1 bg-amber-500 rounded-full text-white" />
              ) : (
                ""
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500 flex">
                {selectedUser.email}
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    if (confirm("Toggle Verified?")) {
                      onClose();
                      toggleVerified.mutate(selectedUser.id);
                    }
                  }}
                >
                  {selectedUser.isVerified ? (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      Verified
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                      Not Verified
                    </span>
                  )}
                </div>
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            {infoItem(
              <Gift className="w-5 h-5" />,
              "Referral Code",
              selectedUser.referralCode
            )}
            {infoItem(
              <User className="w-5 h-5" />,
              "Referrer",
              selectedUser["referrer.name"] ? (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {selectedUser["referrer.name"]}
                  </span>
                  <span className="text-xs font-normal text-gray-600">
                    {selectedUser["referrer.email"]}
                  </span>
                </div>
              ) : (
                "No Referrer"
              )
            )}

            {infoItem(
              selectedUser.isActive ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              ),
              "Account Status",
              selectedUser.isActive ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  Active
                </span>
              ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                  Inactive
                </span>
              )
            )}
            {infoItem(
              selectedUser.isBlocked ? (
                <Lock className="w-5 h-5 text-red-500" />
              ) : (
                <Unlock className="w-5 h-5 text-green-500" />
              ),
              "Block Status",
              selectedUser.isBlocked ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                  Blocked
                </span>
              ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  Not Blocked
                </span>
              )
            )}
            {infoItem(
              <User className="w-5 h-5" />,
              "User Rank",
              selectedUser.rank || "No Rank"
            )}
            {infoItem(
              <Phone className="w-5 h-5" />,
              "Phone Number",
              selectedUser.phone || "Not Provided"
            )}
            {infoItem(
              <Calendar className="w-5 h-5" />,
              "Date of Birth",
              selectedUser.dob
                ? formatDate(selectedUser.dob, false)
                : "Not Provided"
            )}
            {infoItem(
              <MapPin className="w-5 h-5" />,
              "Location",
              selectedUser.location || "Not Provided"
            )}
            {infoItem(
              <Calendar className="w-5 h-5" />,
              "Member Since",
              formatDate(selectedUser.createdAt)
            )}
            {infoItem(
              <Calendar className="w-5 h-5" />,
              "Last Updated",
              formatDate(selectedUser.updatedAt)
            )}
          </div>
        </div>

        {/* Right Column: Action Buttons */}
        <div className="lg:w-2/5 xl:w-1/3 flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              User Actions
            </h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-100"
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
                className="w-full justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  onClose();
                  router.push(`/wallet-histories?userId=${selectedUser.id}`);
                }}
              >
                <Wallet className="w-4 h-4 mr-2" />
                View Wallet History
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  onClose();
                  router.push(`/stakings?userId=${selectedUser.id}`);
                }}
              >
                <Coins className="w-4 h-4 mr-2" />
                View Stakings
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full justify-center py-3 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  onClose();
                  router.push(`/referrals/${selectedUser.id}/tree`);
                }}
              >
                <Network className="w-4 h-4 mr-2" />
                View Referral Tree
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <Button
                variant={selectedUser.isBlocked ? "success" : "danger"}
                size="md"
                className="w-full justify-center py-3 disabled:opacity-50"
                disabled={toggleMutation.isPending}
                onClick={async () => {
                  onClose();

                  const result = await Swal.fire({
                    title: selectedUser.isBlocked
                      ? "Unblock User?"
                      : "Block User?",
                    text: selectedUser.isBlocked
                      ? "This user will be able to access their account again."
                      : "This user will not be able to access their account.",
                    icon: "question",
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
                {toggleMutation.isPending ? (
                  <span>Processing...</span>
                ) : selectedUser.isBlocked ? (
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

              <p className="text-xs text-gray-500 mt-2 text-center">
                {selectedUser.isBlocked
                  ? "User account is currently blocked"
                  : "User account is currently active"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;
