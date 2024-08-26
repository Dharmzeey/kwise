'use client'
import { useRouter } from 'next/navigation';

const ProductNotFound = () => {
	const router = useRouter();

	const handleBackToShop = () => {
		router.push('/');
	};

	return (
		<div className="flex flex-col items-center justify-center h-[60vh] p-4">
			<h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Product Not Found</h1>
			<p className="text-lg text-gray-600 mb-6 text-center">
				The product you requested cannot be found
			</p>
			<button
				onClick={handleBackToShop}
				className="bg-secondary-color text-white px-6 py-3 rounded-md shadow hover:opacity-90 transition-colors duration-300"
			>
				Back to Home
			</button>
		</div>
	);
};

export default ProductNotFound;
