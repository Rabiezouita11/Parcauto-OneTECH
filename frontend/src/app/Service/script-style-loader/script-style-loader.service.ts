import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptStyleLoaderService {

  loadScripts(scripts: string[]): void {
    scripts.forEach(script => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;
      document.head.appendChild(scriptElement);
    });
  }

  loadStyles(styles: string[]): void {
    styles.forEach(style => {
      const linkElement = document.createElement('link');
      linkElement.href = style;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    });
  }
}
