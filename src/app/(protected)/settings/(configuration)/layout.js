"use client";

import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ConfigContext = createContext(null);

export { ConfigContext };

const ConfigurationLayout = ({ children }) => {
  const { data: config } = useQuery({
    queryKey: ["configs"],
    queryFn: async () => {
      const response = await api.get("/configs");

      return response.data.payload.configs;
    },
  });

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Shared Header */}
        <div className="bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            System Configuration
          </h1>
          <p className="text-gray-600">
            Manage your platform settings and token configurations
          </p>
        </div>

        {/* Page Content */}
        <ConfigContext.Provider value={config}>
          {children}
        </ConfigContext.Provider>
      </div>
    </div>
  );
};

export default ConfigurationLayout;
