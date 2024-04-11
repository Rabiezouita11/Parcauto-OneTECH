import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptAuthService {

  loadScripts(scripts: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let loadedScripts = 0;
      const totalScripts = scripts.length;

      scripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.onload = () => {
          loadedScripts++;
          if (loadedScripts === totalScripts) {
            resolve();
          }
        };
        scriptElement.onerror = (error) => {
          reject(error);
        };
        document.body.appendChild(scriptElement);
      });
    });
  }

  loadStyles(styles: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let loadedStyles = 0;
      const totalStyles = styles.length;

      styles.forEach(style => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = style;
        linkElement.onload = () => {
          loadedStyles++;
          if (loadedStyles === totalStyles) {
            resolve();
          }
        };
        linkElement.onerror = (error) => {
          reject(error);
        };
        document.head.appendChild(linkElement);
      });
    });
  }
}