import Image from "next/image";

export default function SignupPage() {
    return (
        <>
            <div>
                <div className="flex justify-center mt-24 mb-9">
                    <Image
                        src="/logo.jpg"
                        alt="kwise"
                        width={75}
                        height={35}
                    />
                </div>
            </div>
        </>
    )
}