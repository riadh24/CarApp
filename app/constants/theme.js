export const COLORS = {
    darkBlue: "#192129",
    blue: "#004BBF",

    white: "#fff",
    white2: '#F9F9F9',
    black: "#020202",
    gray: "#777777",
    darkgray: '#333333',
    lightGray: "#F5F6FB",
    lightGray2: '#757575',

    transparentBlack3: 'rgba(2, 2, 2, 0.3)',
    transparentBlack5: 'rgba(2, 2, 2, 0.5)',
    transparentBlack7: 'rgba(2, 2, 2, 0.7)',
    transparentBlack9: 'rgba(2, 2, 2, 0.9)',

    transparentGray: 'rgba(77,77,77, 0.8)',
};

export const getThemeColors = (isDarkTheme) => ({
    background: isDarkTheme ? '#1a1a1a' : '#ffffff',
    surface: isDarkTheme ? '#2d2d2d' : '#f8f9fa',
    text: isDarkTheme ? '#ffffff' : '#333333',
    textSecondary: isDarkTheme ? '#cccccc' : '#666666',
    border: isDarkTheme ? '#404040' : '#e0e0e0',
    accent: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
});

const appTheme = { COLORS, getThemeColors };

export default appTheme;