import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'youtubeThumb', standalone: true })
export class YoutubeThumbPipe implements PipeTransform {

  private extractId(url: string): string | null {
    try {
      const norm = url.trim().match(/^https?:\/\//i) ? url : `https://${url}`;
      const u = new URL(norm);
      if (u.hostname === 'youtu.be')            return u.pathname.slice(1);
      if (u.hostname.includes('youtube.com'))  return u.searchParams.get('v');
    } catch { /* ignore */ }
    return null;
  }

  transform(
    url: string,
    quality: 'default'|'mqdefault'|'hqdefault'|'sddefault'|'maxresdefault' = 'hqdefault'
  ): string | null {
    const id = this.extractId(url);
    return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
  }
}
