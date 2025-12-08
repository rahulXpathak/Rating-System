import React, { useState } from 'react';

const StarRating = ({ rating, onRate }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "on" : "off"}
                        onClick={() => onRate(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            color: index <= (hover || rating) ? '#ffc107' : '#e4e5e9'
                        }}
                    >
                        <span>&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
