/**
 * Cosmic Mode Easter Egg
 * Activated by clicking the logo 5 times rapidly
 * Adds floating particles and cosmic effects to the UI
 */

export class CosmicMode {
  private static instance: CosmicMode | null = null;
  private isActive: boolean = false;
  private clickCount: number = 0;
  private clickTimeout: NodeJS.Timeout | null = null;
  private particles: HTMLElement[] = [];
  private animationFrame: number | null = null;
  private readonly CLICK_THRESHOLD = 5;
  private readonly CLICK_TIMEOUT = 2000; // 2 seconds

  constructor() {
    if (CosmicMode.instance) {
      return CosmicMode.instance;
    }
    CosmicMode.instance = this;
  }

  /**
   * Initialize cosmic mode listeners
   */
  public initialize(): void {
    this.attachLogoClickListener();
  }

  /**
   * Attach click listener to the logo
   */
  private attachLogoClickListener(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.findAndAttachToLogo());
    } else {
      this.findAndAttachToLogo();
    }
  }

  /**
   * Find the logo element and attach click listener
   */
  private findAndAttachToLogo(): void {
    // Look for the logo text
    const observer = new MutationObserver(() => {
      const logoElement = this.findLogoElement();
      if (logoElement) {
        logoElement.addEventListener('click', this.handleLogoClick);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also try immediately in case the logo is already there
    const logoElement = this.findLogoElement();
    if (logoElement) {
      logoElement.addEventListener('click', this.handleLogoClick);
    }
  }

  /**
   * Find the logo element in the DOM
   */
  private findLogoElement(): HTMLElement | null {
    // Look for text containing "SEFGH-AI"
    const elements = document.querySelectorAll('*');
    for (const element of elements) {
      if (element.textContent?.includes('SEFGH-AI') && 
          element.tagName !== 'SCRIPT' && 
          element.tagName !== 'STYLE') {
        return element as HTMLElement;
      }
    }
    return null;
  }

  /**
   * Handle logo click events
   */
  private handleLogoClick = (event: MouseEvent): void => {
    event.preventDefault();
    
    this.clickCount++;
    
    // Clear existing timeout
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    // Set new timeout to reset click count
    this.clickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, this.CLICK_TIMEOUT);

    // Check if threshold reached
    if (this.clickCount >= this.CLICK_THRESHOLD) {
      this.toggleCosmicMode();
      this.clickCount = 0;
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }
    }
  };

  /**
   * Toggle cosmic mode on/off
   */
  public toggleCosmicMode(): void {
    if (this.isActive) {
      this.deactivateCosmicMode();
    } else {
      this.activateCosmicMode();
    }
  }

  /**
   * Activate cosmic mode
   */
  private activateCosmicMode(): void {
    if (this.isActive) return;

    this.isActive = true;
    console.log('🌌 COSMIC MODE ACTIVATED! 🌌');
    
    // Add cosmic class to body for global effects
    document.body.classList.add('cosmic-mode');
    
    // Create particle container
    this.createParticleContainer();
    
    // Start particle animation
    this.startParticleAnimation();
    
    // Add cosmic effects to UI elements
    this.addCosmicEffects();
    
    // Show notification
    this.showCosmicNotification('🌌 Cosmic Mode Activated! ✨');
    
    // Store state in localStorage
    localStorage.setItem('sefgh-cosmic-mode', 'active');
  }

  /**
   * Deactivate cosmic mode
   */
  private deactivateCosmicMode(): void {
    if (!this.isActive) return;

    this.isActive = false;
    console.log('🌍 Returning to normal space... 🌍');
    
    // Remove cosmic class from body
    document.body.classList.remove('cosmic-mode');
    
    // Stop animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // Remove particles
    this.removeParticles();
    
    // Remove cosmic effects
    this.removeCosmicEffects();
    
    // Show notification
    this.showCosmicNotification('🌍 Returned to Earth');
    
    // Remove from localStorage
    localStorage.removeItem('sefgh-cosmic-mode');
  }

  /**
   * Create particle container
   */
  private createParticleContainer(): void {
    const container = document.createElement('div');
    container.id = 'cosmic-particle-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `;
    
    document.body.appendChild(container);
    
    // Create particles
    this.createParticles(container);
  }

  /**
   * Create floating particles
   */
  private createParticles(container: HTMLElement): void {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'cosmic-particle';
      
      const size = Math.random() * 4 + 2;
      const hue = Math.random() * 60 + 250; // Purple to blue range
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: hsl(${hue}, 80%, 70%);
        border-radius: 50%;
        box-shadow: 0 0 ${size * 2}px hsl(${hue}, 80%, 70%);
        opacity: ${Math.random() * 0.5 + 0.3};
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
      `;
      
      // Add random animation data
      particle.setAttribute('data-speed', (Math.random() * 0.5 + 0.1).toString());
      particle.setAttribute('data-direction', (Math.random() * Math.PI * 2).toString());
      
      container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  /**
   * Start particle animation loop
   */
  private startParticleAnimation(): void {
    const animate = () => {
      this.particles.forEach(particle => {
        const speed = parseFloat(particle.getAttribute('data-speed') || '0.1');
        const direction = parseFloat(particle.getAttribute('data-direction') || '0');
        
        const currentTop = parseFloat(particle.style.top);
        const currentLeft = parseFloat(particle.style.left);
        
        let newTop = currentTop + Math.sin(direction) * speed;
        let newLeft = currentLeft + Math.cos(direction) * speed;
        
        // Wrap around screen edges
        if (newTop > 100) newTop = -5;
        if (newTop < -5) newTop = 100;
        if (newLeft > 100) newLeft = -5;
        if (newLeft < -5) newLeft = 100;
        
        particle.style.top = newTop + 'vh';
        particle.style.left = newLeft + 'vw';
      });
      
      if (this.isActive) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * Remove particles
   */
  private removeParticles(): void {
    const container = document.getElementById('cosmic-particle-container');
    if (container) {
      container.remove();
    }
    this.particles = [];
  }

  /**
   * Add cosmic effects to UI elements
   */
  private addCosmicEffects(): void {
    // Add subtle glow to interactive elements
    const style = document.createElement('style');
    style.id = 'cosmic-effects-style';
    style.textContent = `
      .cosmic-mode button:hover {
        box-shadow: 0 0 15px hsl(var(--primary) / 0.5) !important;
        transition: box-shadow 0.3s ease !important;
      }
      
      .cosmic-mode .glass-effect {
        background: hsl(var(--background) / 0.8) !important;
        backdrop-filter: blur(15px) !important;
      }
      
      .cosmic-mode [class*="gradient-text"] {
        animation: cosmic-text-glow 2s ease-in-out infinite alternate;
      }
      
      @keyframes cosmic-text-glow {
        0% {
          filter: drop-shadow(0 0 5px hsl(var(--primary) / 0.5));
        }
        100% {
          filter: drop-shadow(0 0 10px hsl(var(--primary) / 0.8));
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Remove cosmic effects
   */
  private removeCosmicEffects(): void {
    const style = document.getElementById('cosmic-effects-style');
    if (style) {
      style.remove();
    }
  }

  /**
   * Show cosmic notification
   */
  private showCosmicNotification(message: string): void {
    // Create temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 9999;
      animation: cosmic-notification 3s ease-out forwards;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    notification.textContent = message;
    
    // Add animation keyframes
    if (!document.querySelector('#cosmic-notification-keyframes')) {
      const style = document.createElement('style');
      style.id = 'cosmic-notification-keyframes';
      style.textContent = `
        @keyframes cosmic-notification {
          0% {
            transform: translateX(300px);
            opacity: 0;
          }
          20%, 80% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(300px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Check if cosmic mode is active
   */
  public isCosmicModeActive(): boolean {
    return this.isActive;
  }

  /**
   * Restore cosmic mode from localStorage
   */
  public restoreCosmicMode(): void {
    const savedState = localStorage.getItem('sefgh-cosmic-mode');
    if (savedState === 'active') {
      this.activateCosmicMode();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): CosmicMode {
    if (!CosmicMode.instance) {
      CosmicMode.instance = new CosmicMode();
    }
    return CosmicMode.instance;
  }
}

/**
 * Initialize cosmic mode
 */
export function initializeCosmicMode(): void {
  const cosmicMode = CosmicMode.getInstance();
  cosmicMode.initialize();
  cosmicMode.restoreCosmicMode(); // Restore if previously activated
}

/**
 * Toggle cosmic mode (for external use)
 */
export function toggleCosmicMode(): void {
  const cosmicMode = CosmicMode.getInstance();
  cosmicMode.toggleCosmicMode();
}