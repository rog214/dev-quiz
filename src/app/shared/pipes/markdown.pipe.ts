import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var marked: any;
declare var Prism: any;

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | undefined | null): SafeHtml | string {
    if (!value) return '';
    try {
      const html = marked.parse(value);

      setTimeout(() => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      }, 150);

      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (e) {
      return value;
    }
  }
}
