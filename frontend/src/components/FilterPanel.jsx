import React, { useState } from 'react';

const FilterPanel = ({ filters, onFilter, onClear }) => {
    const [filterValues, setFilterValues] = useState({});

    const handleChange = (filterKey, value) => {
        setFilterValues(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const handleApply = (e) => {
        e.preventDefault();
        onFilter(filterValues);
    };

    const handleClear = () => {
        setFilterValues({});
        onClear();
    };

    return (
        <form className="filter-panel" onSubmit={handleApply}>
            <div className="filter-grid">
                {filters.map((filter) => (
                    <div key={filter.key} className="filter-item">
                        <label htmlFor={filter.key}>{filter.label}</label>
                        {filter.type === 'select' ? (
                            <select
                                id={filter.key}
                                value={filterValues[filter.key] || ''}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                            >
                                <option value="">All</option>
                                {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                id={filter.key}
                                value={filterValues[filter.key] || ''}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                                placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="filter-actions">
                <button type="submit" className="btn btn-primary">Apply Filters</button>
                <button type="button" onClick={handleClear} className="btn btn-secondary">Clear</button>
            </div>
        </form>
    );
};

export default FilterPanel;
