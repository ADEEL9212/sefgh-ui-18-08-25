/**
 * Easter Eggs Index
 * Central hub for all Easter egg functionality
 */

export { createKonamiCode, KonamiCode } from './konami';
export { 
  initializeConsoleMessages, 
  showWelcomeMessage,
  showRandomTip,
  showRandomSecret,
  showCredits,
  showDevelopmentInfo,
  showEasterEggHints,
  showBirthdayMessage
} from './console-messages';
export { 
  initializeCosmicMode, 
  toggleCosmicMode, 
  CosmicMode 
} from './cosmic-mode';

/**
 * Initialize all Easter eggs
 */
export function initializeAllEasterEggs(): void {
  // Initialize console messages
  initializeConsoleMessages();
  
  // Initialize cosmic mode
  initializeCosmicMode();
  
  // Initialize Konami code
  const konamiCode = createKonamiCode();
  konamiCode.start();
  
  // Add global easter egg functions to window for easy access
  if (typeof window !== 'undefined') {
    (window as any).easterEggs = {
      cosmic: toggleCosmicMode,
      konami: konamiCode,
      console: {
        welcome: showWelcomeMessage,
        tip: showRandomTip,
        secret: showRandomSecret,
        credits: showCredits,
        dev: showDevelopmentInfo,
        hints: showEasterEggHints
      }
    };
  }
  
  console.log('%c🥚 Easter eggs initialized! Type easterEggs in console for access.', 
    'color: #6C5CE7; font-weight: bold;');
}