import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ScriptStyleLoaderService {
  private loadedScripts: Set<string> = new Set<string>(); // Keep track of loaded scripts

  loadScripts(scriptPaths: string[]): Promise<void> {
    const loadScriptPromises = scriptPaths.map(path => this.loadScript(path));
    return Promise.all(loadScriptPromises).then(() => {});
  }

  loadStyles(stylePaths: string[]): Promise<void> {
    const loadStylePromises = stylePaths.map(path => this.loadStyle(path));
    return Promise.all(loadStylePromises).then(() => {});
  }

  private loadScript(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.loadedScripts.has(path)) { // Check if script is already loaded
        resolve();
      } else {
        const scriptElement = document.createElement('script');
        scriptElement.src = path;
        scriptElement.async = true; // Load script asynchronously
        scriptElement.onload = () => {
          this.loadedScripts.add(path); // Mark script as loaded
          resolve();
        };
        scriptElement.onerror = (error) => {
          console.error('Error loading script:', error);
          reject(error);
        };
        document.body.appendChild(scriptElement);
      }
    });
  }
  
  private loadStyle(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = path;
      linkElement.onload = () => resolve();
      linkElement.onerror = (error) => {
        console.error('Error loading style:', error);
        reject(error);
      };
      document.head.appendChild(linkElement);
    });
  }
}
