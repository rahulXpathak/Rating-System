import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search stores..." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-wrapper">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="clear-btn"
                    >
                        ✕
                    </button>
                )}
                <button type="submit" className="search-btn">
                    🔍 Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
