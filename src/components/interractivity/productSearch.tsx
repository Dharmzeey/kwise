'use client';

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function HandleProductSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            router.push(`/products/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            handleSearchSubmit();
        }
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-[1fr_auto] border border-black rounded">
                    <input
                        type="text"
                        placeholder="Search item..."
                        className="p-2 border-r border-black"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        type="button" 
                        className="bg-main-color p-2 cursor-pointer" 
                        onClick={handleSearchSubmit}
                    >
                        <FontAwesomeIcon icon={faSearch} className="text-xl text-white" />
                    </button>
                </div>
            </form>
        </>
    );
}
