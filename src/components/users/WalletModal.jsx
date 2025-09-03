"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { DollarSign, Coins, Plus, Minus, Wallet } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

const WalletModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("add");

  const mutation = useMutation({
    mutationFn: (transactionData) =>
      api.put(`/wallet/${user.id}`, transactionData),
    onSuccess: (response) => {
      onClose();
      toast.success(response.data.message);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      currency: activeTab,
      amount:
        transactionType === "add"
          ? Math.abs(Number(amount))
          : -Math.abs(Number(amount)),
      type: transactionType,
      userId: user.id,
    };

    mutation.mutate(transactionData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wallet Management"
      size="md"
    >
      <div className="flex flex-col gap-6">
        {/* Current Balances */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Current Balances
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm text-gray-600">USDT Balance</h4>
              </div>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat().format(user.usdt) || 0} USDT
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm text-gray-600">3TWENTY Balance</h4>
              </div>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat().format(user.token) || 0} 3TWENTY
              </p>
            </div>
          </div>
        </div>

        {/* Manage Wallet */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Manage Wallet</h3>

          {/* Currency Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-2 px-4 text-sm ${
                activeTab === "USDT"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("USDT")}
            >
              USDT
            </button>
            <button
              className={`py-2 px-4 text-sm ${
                activeTab === "3TWENTY"
                  ? "border-b-2 border-purple-500 text-purple-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("3TWENTY")}
            >
              3TWENTY
            </button>
          </div>

          {/* Transaction Type */}
          <div className="flex gap-2 mb-4">
            <button
              className={`flex items-center gap-1 py-2 px-3 rounded-lg border text-sm ${
                transactionType === "add"
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "border-gray-300"
              }`}
              onClick={() => setTransactionType("add")}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              className={`flex items-center gap-1 py-2 px-3 rounded-lg border text-sm ${
                transactionType === "subtract"
                  ? "bg-red-50 text-red-700 border-red-300"
                  : "border-gray-300"
              }`}
              onClick={() => setTransactionType("subtract")}
            >
              <Minus className="w-4 h-4" />
              Subtract
            </button>
          </div>

          {/* Amount Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount to {transactionType === "add" ? "add" : "subtract"}
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${activeTab} amount`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm">
                  {activeTab}
                </div>
              </div>
            </div>

            {/* Preview */}
            {amount && (
              <div
                className={`p-2 rounded mb-4 text-sm ${
                  transactionType === "add"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <p>
                  {transactionType === "add" ? "Adding" : "Subtracting"}{" "}
                  {amount} {activeTab}
                </p>
                <p className="mt-1">
                  New balance:{" "}
                  {(transactionType === "add"
                    ? (Number(user[activeTab === "USDT" ? "usdt" : "token"]) ||
                        0) + Number(amount)
                    : (Number(user[activeTab === "USDT" ? "usdt" : "token"]) ||
                        0) - Number(amount)
                  ).toFixed(2)}{" "}
                  {activeTab}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              isLoading={mutation.isPending}
              type="submit"
              className="w-full justify-center"
              variant={transactionType === "add" ? "primary" : "danger"}
            >
              {transactionType === "add" ? "Add Funds" : "Subtract Funds"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
