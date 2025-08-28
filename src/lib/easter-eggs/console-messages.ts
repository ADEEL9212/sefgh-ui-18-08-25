/**
 * Console Messages Easter Egg
 * Displays ASCII art and hidden messages in the developer console
 */

/**
 * ASCII Art and Console Messages
 */
const ASCII_ART = {
  logo: `
 ██████╗ ██████╗ ███████╗███╗   ███╗██╗ ██████╗    ██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ ██████╗ ███╗   ██╗██╗   ██╗
██╔════╝██╔═══██╗██╔════╝████╗ ████║██║██╔════╝    ██║  ██║██╔══██╗██╔══██╗████╗ ████║██╔═══██╗████╗  ██║╚██╗ ██╔╝
██║     ██║   ██║███████╗██╔████╔██║██║██║         ███████║███████║██████╔╝██╔████╔██║██║   ██║██╔██╗ ██║ ╚████╔╝ 
██║     ██║   ██║╚════██║██║╚██╔╝██║██║██║         ██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██║   ██║██║╚██╗██║  ╚██╔╝  
╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║██║╚██████╗    ██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║╚██████╔╝██║ ╚████║   ██║   
 ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   
`,
  
  stars: `
    ✨ * ⭐ ° ✦ * ☆ ° ⭐ * ✨ ° ☆ * ⭐ ✦ * ✨ ° ☆ *
    *       Welcome to the Cosmic Harmony Universe!       *
    ☆ * ✦ ° ⭐ * ✨ ° ☆ * ⭐ ✦ ° ✨ * ☆ ° ⭐ *
`,

  rocket: `
           🚀
          /|\\
         / | \\
        /  |  \\
       /___|___\\
      |    🌟   |
      |    🌟   |
      |_________|
        🔥🔥🔥
`,

  planet: `
        🌍 🌙 ⭐
       /       \\
      |  SEFGH  |
      |   AI    |
       \\       /
        🌟 ✨ 🌟
`
};

const MESSAGES = {
  welcome: [
    '🌟 Welcome to SEFGH-AI, fellow explorer!',
    '✨ You\'ve discovered the cosmic console!',
    '🚀 Ready to explore the universe of code?'
  ],
  
  tips: [
    '💡 Pro tip: Try typing "cosmic" in the search bar for a surprise!',
    '🎯 Easter egg hint: There\'s a secret mode hidden in the logo...',
    '🔍 Debug tip: Check the network tab for cosmic API endpoints!',
    '⚡ Performance tip: We use modern animations that respect your motion preferences!',
    '🎨 Design tip: Our color palette changes based on your theme preference!'
  ],
  
  secrets: [
    '🤫 Secret: There are multiple hidden themes you can unlock!',
    '🎭 Secret: Try the Konami code for a stellar surprise!',
    '🎪 Secret: Some components have hidden animation states!',
    '🎮 Secret: Keyboard ninjas get special treatment here!',
    '🎨 Secret: The sidebar has gradient superpowers!'
  ],
  
  credits: [
    '👩‍💻 Built with love by the SEFGH team',
    '⚡ Powered by React, TypeScript, and cosmic energy',
    '🎨 Designed with Tailwind CSS and Framer Motion',
    '🌟 Icons by Lucide React',
    '💫 Inspired by the infinite possibilities of space'
  ]
};

/**
 * Console styling
 */
const CONSOLE_STYLES = {
  header: 'background: linear-gradient(90deg, #6C5CE7, #0ABDE3); color: white; padding: 10px; font-size: 16px; font-weight: bold; border-radius: 8px;',
  info: 'color: #6C5CE7; font-size: 14px; font-weight: bold;',
  tip: 'color: #0ABDE3; font-size: 12px;',
  secret: 'color: #FF5E7D; font-size: 12px; font-style: italic;',
  credit: 'color: #26DE81; font-size: 11px;',
  ascii: 'color: #6C5CE7; font-family: monospace; line-height: 1.2;',
  gradient: 'background: linear-gradient(90deg, #6C5CE7, #0ABDE3, #FFC048); -webkit-background-clip: text; color: transparent; font-size: 20px; font-weight: bold;'
};

/**
 * Display welcome message with ASCII art
 */
export function showWelcomeMessage(): void {
  console.clear();
  
  // ASCII Logo
  console.log('%c' + ASCII_ART.logo, CONSOLE_STYLES.ascii);
  
  // Welcome header
  console.log('%c🌟 COSMIC HARMONY CONSOLE 🌟', CONSOLE_STYLES.header);
  
  // Stars decoration
  console.log('%c' + ASCII_ART.stars, CONSOLE_STYLES.ascii);
  
  // Welcome messages
  MESSAGES.welcome.forEach(message => {
    console.log('%c' + message, CONSOLE_STYLES.info);
  });
  
  console.log('\n');
}

/**
 * Display random tip
 */
export function showRandomTip(): void {
  const randomTip = MESSAGES.tips[Math.floor(Math.random() * MESSAGES.tips.length)];
  console.log('%c' + randomTip, CONSOLE_STYLES.tip);
}

/**
 * Display random secret
 */
export function showRandomSecret(): void {
  const randomSecret = MESSAGES.secrets[Math.floor(Math.random() * MESSAGES.secrets.length)];
  console.log('%c' + randomSecret, CONSOLE_STYLES.secret);
}

/**
 * Display credits
 */
export function showCredits(): void {
  console.log('%c📝 CREDITS', CONSOLE_STYLES.header);
  MESSAGES.credits.forEach(credit => {
    console.log('%c' + credit, CONSOLE_STYLES.credit);
  });
}

/**
 * Display development info
 */
export function showDevelopmentInfo(): void {
  console.log('%c🛠️ DEVELOPMENT INFO', CONSOLE_STYLES.header);
  
  const info = [
    `🏗️ Build: development`,
    `⚡ Vite: 5.4.10`,
    `🎯 Environment: development`,
    `🌐 Base URL: /`,
    `📦 App Version: 1.0.0`
  ];
  
  info.forEach(item => {
    console.log('%c' + item, CONSOLE_STYLES.info);
  });
}

/**
 * Show easter egg hints
 */
export function showEasterEggHints(): void {
  console.log('%c🥚 EASTER EGG HINTS', CONSOLE_STYLES.header);
  
  const hints = [
    '🔍 Try clicking the logo 5 times quickly...',
    '⌨️ The classic gaming code still works here!',
    '🎭 Type special keywords in the search bar',
    '🎮 Some keyboard combinations unlock hidden features',
    '🎨 There are secret themes waiting to be discovered',
    '🎪 Birthday celebrations might surprise you!',
    '📊 Look for the secret admin dashboard',
    '✨ Particle effects can be triggered in various ways'
  ];
  
  hints.forEach(hint => {
    console.log('%c' + hint, CONSOLE_STYLES.secret);
  });
}

/**
 * Display interactive console commands
 */
export function showConsoleCommands(): void {
  console.log('%c⚡ CONSOLE COMMANDS', CONSOLE_STYLES.header);
  
  // Make commands available globally for easy access
  if (typeof window !== 'undefined') {
    (window as any).cosmic = {
      welcome: showWelcomeMessage,
      tip: showRandomTip,
      secret: showRandomSecret,
      credits: showCredits,
      dev: showDevelopmentInfo,
      hints: showEasterEggHints,
      commands: showConsoleCommands,
      party: () => {
        console.log('%c🎉 PARTY TIME! 🎉', CONSOLE_STYLES.gradient);
        console.log('%c' + ASCII_ART.rocket, CONSOLE_STYLES.ascii);
        console.log('%c' + ASCII_ART.planet, CONSOLE_STYLES.ascii);
      }
    };
  }
  
  const commands = [
    'cosmic.welcome() - Show welcome message',
    'cosmic.tip() - Get a random tip',
    'cosmic.secret() - Reveal a secret',
    'cosmic.credits() - Show credits',
    'cosmic.dev() - Development info',
    'cosmic.hints() - Easter egg hints',
    'cosmic.party() - 🎉 Party mode!',
    'cosmic.commands() - Show this list'
  ];
  
  commands.forEach(command => {
    console.log('%c' + command, CONSOLE_STYLES.info);
  });
  
  console.log('\n%cTry typing any of these commands!', CONSOLE_STYLES.tip);
}

/**
 * Initialize console messages
 */
export function initializeConsoleMessages(): void {
  // Show welcome message immediately
  showWelcomeMessage();
  
  // Show a tip after a delay
  setTimeout(showRandomTip, 2000);
  
  // Show commands info
  setTimeout(showConsoleCommands, 4000);
  
  // Periodically show tips and secrets
  setInterval(() => {
    if (Math.random() > 0.5) {
      showRandomTip();
    } else {
      showRandomSecret();
    }
  }, 30000); // Every 30 seconds
}

/**
 * Special birthday message
 */
export function showBirthdayMessage(): void {
  console.log('%c🎂 HAPPY BIRTHDAY! 🎂', CONSOLE_STYLES.gradient);
  console.log('%c🎉 The cosmos celebrates with you today! 🎉', CONSOLE_STYLES.info);
  console.log('%c' + ASCII_ART.rocket, CONSOLE_STYLES.ascii);
}