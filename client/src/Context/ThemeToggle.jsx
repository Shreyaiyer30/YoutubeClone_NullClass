// import React from 'react';
// import { useTheme } from './ThemeContext';
// import { BsSun, BsMoonStars } from 'react-icons/bs';
// import './ThemeToggle.css';

// const ThemeToggle = () => {
//     const { isDarkMode, toggleTheme } = useTheme();

//     return (
//         <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
//             {isDarkMode ? <BsSun size={20} /> : <BsMoonStars size={20} />}
//         </button>
//     );
// };

// export default ThemeToggle;
import React from 'react';
import { useTheme } from './ThemeContext';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDarkMode ? <BsSun size={20} /> : <BsMoonStars size={20} />}
        </button>
    );
};

export default ThemeToggle;