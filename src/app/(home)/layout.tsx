import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import type { Metadata } from "next";
import { Istok_Web } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Providers } from "@/contexts/providers";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const istokWeb = Istok_Web({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: false,
});


export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <div className={`${istokWeb.className} text-xs md:text-sm bg-white `}>
                <Header />
                <div className="container m-auto py-4 px-2 lg:px-28 min-h-[80svh]">{children}</div>
                <Footer />
                <ToastContainer
                    limit={5}
                    autoClose={2000}
                    transition={Slide}
                    closeOnClick
                />
            </div>
        </Providers>
    );
}
