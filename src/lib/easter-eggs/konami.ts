/**
 * Konami Code Easter Egg
 * Triggers cosmic animation when the classic sequence is entered
 * Sequence: ↑↑↓↓←→←→BA
 */

export class KonamiCode {
  private sequence: string[] = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  private userInput: string[] = [];
  private callback: () => void;
  private isListening: boolean = false;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  /**
   * Start listening for the Konami code
   */
  public start(): void {
    if (this.isListening) return;
    
    this.isListening = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Stop listening for the Konami code
   */
  public stop(): void {
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Ignore if user is typing in an input field
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    this.userInput.push(event.code);

    // Keep only the last N keys where N is the length of our sequence
    if (this.userInput.length > this.sequence.length) {
      this.userInput = this.userInput.slice(-this.sequence.length);
    }

    // Check if the sequence matches
    if (this.userInput.length === this.sequence.length && this.sequenceMatches()) {
      this.triggerKonamiCode();
      this.userInput = []; // Reset the sequence
    }
  };

  /**
   * Check if the current user input matches the Konami sequence
   */
  private sequenceMatches(): boolean {
    return this.userInput.every((key, index) => key === this.sequence[index]);
  }

  /**
   * Trigger the Konami code callback and show celebration
   */
  private triggerKonamiCode(): void {
    console.log('🌟 KONAMI CODE ACTIVATED! 🌟');
    
    // Add some cosmic flair to the console
    console.log(`
    ⭐ ✨ 🌟 ⭐ ✨ 🌟 ⭐ ✨ 🌟 ⭐ ✨
    🌟  COSMIC HARMONY ACTIVATED!  🌟
    ✨   Stars shoot across space   ✨
    ⭐      Universe awakened!      ⭐
    🌟 ✨ ⭐ 🌟 ✨ ⭐ 🌟 ✨ ⭐ 🌟 ✨
    `);

    // Trigger the callback
    this.callback();
  }

  /**
   * Get the current progress of the sequence
   */
  public getProgress(): number {
    return this.userInput.length / this.sequence.length;
  }

  /**
   * Reset the current sequence
   */
  public reset(): void {
    this.userInput = [];
  }
}

/**
 * Create and return a Konami code instance with cosmic star animation
 */
export const createKonamiCode = (callback?: () => void) => {
  const defaultCallback = () => {
    // Create cosmic star shower effect
    createCosmicStarShower();
    
    // Show a notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🌟 Konami Code Activated!', {
          body: 'Cosmic Harmony awakened! Stars are shooting across the universe!',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return new KonamiCode(callback || defaultCallback);
};

/**
 * Create a cosmic star shower animation
 */
function createCosmicStarShower(): void {
  const container = document.body;
  const starCount = 20;

  for (let i = 0; i < starCount; i++) {
    setTimeout(() => {
      createShootingStar(container);
    }, i * 100); // Stagger the stars
  }
}

/**
 * Create a single shooting star element
 */
function createShootingStar(container: HTMLElement): void {
  const star = document.createElement('div');
  star.className = 'konami-star';
  
  // Random position at the top of the screen
  const startX = Math.random() * window.innerWidth;
  const endX = startX + (Math.random() - 0.5) * 400;
  const size = Math.random() * 4 + 2;
  
  star.style.cssText = `
    position: fixed;
    top: -10px;
    left: ${startX}px;
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(45deg, #6C5CE7, #0ABDE3);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 0 ${size * 2}px hsl(var(--primary)), 0 0 ${size * 4}px hsl(var(--accent));
    animation: shootingStar 2s ease-out forwards;
  `;

  // Add shooting star animation
  const keyframes = `
    @keyframes shootingStar {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translateY(${window.innerHeight + 20}px) translateX(${endX - startX}px) scale(0.5);
        opacity: 0;
      }
    }
  `;

  // Add keyframes to the document if not already present
  if (!document.querySelector('#konami-keyframes')) {
    const style = document.createElement('style');
    style.id = 'konami-keyframes';
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  container.appendChild(star);

  // Remove the star after animation
  setTimeout(() => {
    if (star.parentNode) {
      star.parentNode.removeChild(star);
    }
  }, 2000);
}