import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import type { Metadata } from "next";
import { Istok_Web } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import { Providers } from "@/contexts/providers";
import Footer from "@/components/footer";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const istokWeb = Istok_Web({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: false,
});

export const metadata: Metadata = {
    title: "Kwise World",
    description:
        "Dealer of guaranteed apple and Samsung phones both brand new, direct UK/US and fairly used. Swap your old phones to latest ones. Guaranteed Laptops, Accessories, Game consoles etc. Retail and bulk purchase always available.",
};

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <Header />
            <div className="container m-auto py-4 px-2 lg:px-28 min-h-[70svh]">{children}</div>
            <Footer />
            <ToastContainer
                limit={5}
                autoClose={2000}
                transition={Slide}
                closeOnClick
            />
        </Providers>
    );
}
