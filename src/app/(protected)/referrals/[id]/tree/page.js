"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User, Mail, IdCard, UserX, ChevronRight } from "lucide-react";

const ReferralTreePage = ({ params }) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["referral-tree", id],
    queryFn: async () => {
      const response = await api.get(`/referrals/${id}/tree`);
      return response.data.payload.tree;
    },
  });

  const processTreeData = (treeData, rootId) => {
    const levels = [[], [], [], [], [], []];
    if (treeData[rootId]) {
      levels[0] = treeData[rootId];
      for (let i = 0; i < 5; i++) {
        levels[i].forEach((person) => {
          if (treeData[person.id]) {
            levels[i + 1] = levels[i + 1].concat(treeData[person.id]);
          }
        });
      }
    }
    return levels;
  };

  const levels = data ? processTreeData(data, id) : [[], [], [], [], [], []];

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Referral Tree
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View user level-wise referral tree
              </p>
            </div>
          </div>

          {/* Tabs Header */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {[1, 2, 3, 4, 5, 6].map((levelNum, index) => (
              <button
                key={index}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 flex items-center ${
                  activeTab === index
                    ? "text-gray-900 border-b-2 border-gray-800 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(index)}
              >
                <span>Level {levelNum}</span>
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {levels[index].length}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : levels[activeTab].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levels[activeTab].map((person) => (
                  <div
                    key={person.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">
                          {person.name}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1 flex items-start">
                          <Mail className="w-4 h-4 mr-1 mt-0.5" />
                          <span className="break-all">{person.email}</span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                            <IdCard className="w-3 h-3 mr-1" />
                            ID: {person.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <UserX className="w-16 h-16 mx-auto text-gray-300" />
                <div className="text-lg font-medium text-gray-500 mt-3">
                  No referrals found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralTreePage;
