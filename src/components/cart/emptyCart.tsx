import { ActionLink } from "../actionComponents";

function EmptyCart() {
    return (
        <>
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">It looks like you haven&rsquo;t made any selection.</p>
                <div className="flex flex-col justify-center items-center gap-1">
                    <ActionLink buttonBgColor="bg-main-color" linkUrl="/" linkText="Keep Shopping" />
                </div>
            </div>
        </>
    )
}
export { EmptyCart }