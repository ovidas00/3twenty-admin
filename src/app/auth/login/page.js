"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const loginMutation = useMutation({
    mutationFn: async () => await api.post("/auth/login", formData),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.data.payload.accessToken);
      setAlert({ type: "success", message: response.data.message });
      setTimeout(() => router.replace("/"), 1000);
    },
    onError: (error) => {
      setAlert({
        type: "error",
        message: error.response?.data?.message || error.message,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-0 md:p-4">
      <div className="w-[95%] max-w-[400px]">
        {/* Login Card */}
        <div className="bg-white rounded-0 rounded-xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Image
              src="/icon-300x60.png"
              alt="Logo"
              width={300}
              height={100}
              className="mx-auto"
            />
            <p className="text-slate-600 p-2">
              Sign in to access the dashboard
            </p>
          </div>

          {/* Alert Message */}
          {alert && (
            <Alert type={alert.type} message={alert.message} className="mb-4" />
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              icon={User}
              required={true}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={Lock}
                required={true}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="pr-12" // Add extra padding for the toggle button
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition duration-200"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  marginTop: "0.9rem",
                }} // Vertically center the button
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="dark"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
              disabled={!formData.username || !formData.password}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
