// app/auth/layout.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 z-0"></div>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm border border-gray-100 overflow-hidden mt-8 mb-12"
            >
                {/* Logo Section */}
                <div className="flex justify-center py-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Image
                            src="/logo.jpg"
                            alt="Kwise World Logo"
                            width={100}
                            height={40}
                            priority
                            className="object-contain"
                        />
                    </motion.div>
                </div>

                {/* Form Container */}
                <div className="px-6 pb-8">{children}</div>
            </motion.div>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                className="z-50"
            />
        </>
    );
}