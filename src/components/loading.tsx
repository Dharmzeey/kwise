import Image from "next/image";

export default function Loading() {
    return (
        <>
            <div className="flex items-center justify-center h-[70vh] relative" >
                <div className="absolute left-1/2 -translate-x-1/2 opacity-50">
                    <Image
                        src="/logo.jpg"
                        alt="kwise"
                        width={75}
                        height={35}
                    />
                </div>
                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-main-color"></div>
            </div>
        </>
    )
}