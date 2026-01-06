import { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const checkDynamicTheme = async () => {
            const now = new Date();
            const hours = now.getHours();
            // Check if time is between 10 AM (10) and 12 PM (12)
            // 10:00 to 12:00 (exclusive of 12? or inclusive? "10 AM to 12 Pm". Usually means 10 <= h < 12).
            const isTimeInRange = hours >= 10 && hours < 12;

            if (isTimeInRange) {
                try {
                    const res = await fetch("https://ipapi.co/json/");
                    const data = await res.json();
                    const region = data.region;
                    const southStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];

                    if (southStates.includes(region)) {
                        setIsDarkMode(false); // Light Mode
                    } else {
                        setIsDarkMode(true); // Dark Mode
                    }
                } catch (error) {
                    console.log("Location fetch failed", error);
                    setIsDarkMode(true); // Default to dark
                }
            } else {
                setIsDarkMode(true);
            }
        };
        checkDynamicTheme();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <div data-theme={isDarkMode ? 'dark' : 'light'}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
