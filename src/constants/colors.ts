/**
 * Data Visualization Color Palette for Cosmic Harmony Theme
 * Provides consistent colors for charts, metrics, and data visualizations
 */

export const visualizationColors = {
  // Primary data series
  primary: {
    light: '#6C5CE7', // Indigo
    dark: '#876AFF'   // Brighter indigo
  },
  // Secondary data series
  secondary: {
    light: '#0ABDE3', // Cyan
    dark: '#18C1F0'   // Brighter cyan
  },
  // Categorical colors for charts
  categorical: [
    { light: '#6C5CE7', dark: '#876AFF' }, // Indigo
    { light: '#0ABDE3', dark: '#18C1F0' }, // Cyan
    { light: '#FD9644', dark: '#FFA766' }, // Orange
    { light: '#FC5C65', dark: '#FF7A80' }, // Red
    { light: '#26DE81', dark: '#3BEF95' }, // Green
    { light: '#A55EEA', dark: '#C583FF' }, // Purple
    { light: '#FFC048', dark: '#FFCC60' }, // Amber
    { light: '#4B7BEC', dark: '#689AFF' }  // Blue
  ],
  // Status colors
  status: {
    success: { light: '#26DE81', dark: '#3BEF95' }, // Green
    warning: { light: '#FFC048', dark: '#FFCC60' }, // Amber
    error: { light: '#FC5C65', dark: '#FF7A80' },   // Red
    info: { light: '#4B7BEC', dark: '#689AFF' }     // Blue
  }
};

/**
 * Get the appropriate color for the current theme
 * @param colorConfig - Color configuration object with light and dark values
 * @param isDark - Whether the current theme is dark
 * @returns The appropriate color value
 */
export const getThemeColor = (
  colorConfig: { light: string; dark: string },
  isDark: boolean = false
): string => {
  return isDark ? colorConfig.dark : colorConfig.light;
};

/**
 * Get all categorical colors for the current theme
 * @param isDark - Whether the current theme is dark
 * @returns Array of color values for the current theme
 */
export const getCategoricalColors = (isDark: boolean = false): string[] => {
  return visualizationColors.categorical.map(color => getThemeColor(color, isDark));
};

/**
 * Get status colors for the current theme
 * @param isDark - Whether the current theme is dark
 * @returns Object with status color values for the current theme
 */
export const getStatusColors = (isDark: boolean = false) => {
  return {
    success: getThemeColor(visualizationColors.status.success, isDark),
    warning: getThemeColor(visualizationColors.status.warning, isDark),
    error: getThemeColor(visualizationColors.status.error, isDark),
    info: getThemeColor(visualizationColors.status.info, isDark),
  };
};