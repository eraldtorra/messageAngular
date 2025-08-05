import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = signal<boolean>(false);
  
  constructor() {
    // Check if user has previously selected dark mode
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.isDarkMode.set(JSON.parse(savedTheme));
    } else {
      // Check system preference
      this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    // Apply initial theme
    this.applyTheme();
  }

  isDark() {
    return this.isDarkMode.asReadonly();
  }

  toggleTheme() {
    this.isDarkMode.update(current => !current);
    this.applyTheme();
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode()));
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode()) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
