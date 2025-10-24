/**
 * Reproductor de vídeo genérico con soporte híbrido:
 *
 * 1. **HTML5 `<video>`** — admite una o varias fuentes y overlay de “play”.
 * 2. **YouTube `<iframe>`** — si la `src` coincide con youtube.com o youtu.be.
 *
 * ### Ejemplo básico (URL directa):
 * ```html
 * <app-generic-video-player
 *   src="https://s3.us-east-2.amazonaws.com/bucket/demo.mp4"
 *   [poster]="'cover.webp'">
 * </app-generic-video-player>
 * ```
 *
 * ### Ejemplo YouTube:
 * ```html
 * <app-generic-video-player
 *   src="https://youtu.be/dQw4w9WgXcQ"
 *   [autoplay]="true"
 *   [loop]="true"
 *   [muted]="true">
 * </app-generic-video-player>
 * ```
 *
 * @remarks
 * - Si `videoSourceList` contiene elementos se ignora `src`.
 * - Para `loop` en YouTube se añade `playlist={id}` automáticamente.
 * - Los vídeos con DRM/HLS/Dash **no** son soportados.
 *
 * @inputs
 * | Propiedad           | Tipo                                   | Default | Descripción                                       |
 * |---------------------|----------------------------------------|---------|---------------------------------------------------|
 * | `videoSourceList`   | `{ src: string; mimeType?: string }[]` | `[]`    | Lista de fuentes para `<video>`                   |
 * | `src`               | `string`                               | –       | URL única (HTML5 o YouTube)                       |
 * | `poster`            | `string`                               | –       | Imagen de portada                                 |
 * | `autoplay`          | `boolean`                              | `false` | Auto-reproducción                                 |
 * | `loop`              | `boolean`                              | `true`  | Repetir vídeo                                     |
 * | `muted`             | `boolean`                              | `false` | Iniciar en silencio                               |
 * | `controls`          | `boolean`                              | `false` | Mostrar controles nativos en `<video>`            |
 * | `width` / `height`  | `number`                               | –       | Dimensiones fijas en px (override aspect-ratio)   |
 *
 */
import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-generic-video-player',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './generic-video-player.component.html',
  styleUrls: ['./generic-video-player.component.scss'],
})
export class GenericVideoPlayerComponent implements OnChanges {
  /** Referencia al elemento `<video>` para control play/pause. */
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  /*───────── Fuentes múltiples ─────────*/

  /** Lista de fuentes para `<video>` en orden de preferencia. */
  @Input() videoSourceList: { src: string; mimeType?: string }[] = [];
  /** Fuente única de vídeo (puede ser HTML5 o YouTube). */
  @Input() src?: string;

  /*───────── Configuración ─────────*/

  /** URL de la imagen de poster para `<video>`. */
  @Input() poster?: string;
  /** Si es `true`, inicia reproducción automáticamente (HTML5) o con `autoplay=1` (YouTube). */
  @Input() autoplay = false;
  /** Si es `true`, repite el vídeo (añade `loop` o `playlist` en YouTube). */
  @Input() loop = true;
  /** Si es `true`, muteará el vídeo al iniciar. */
  @Input() muted = false;
  /** Si es `true`, muestra controles nativos en `<video>`. */
  @Input() controls = false;

  /*───────── Dimensiones ─────────*/

  /** Anchura fija en píxeles (override aspect-ratio). */
  @Input() width?: number;
  /** Altura fija en píxeles (override aspect-ratio). */
  @Input() height?: number;

  /*───────── Estado HTML5 ─────────*/

  /** Estado interno: se está reproduciendo el `<video>`. */
  isPlaying = false;

  /*───────── YouTube ─────────*/

  /** Indica si la `src` corresponde a un vídeo de YouTube. */
  isYoutube = false;
  /** URL embebida ya sanitizada para `<iframe>`. */
  youtubeEmbedUrl?: SafeResourceUrl;
  private readonly youtubePattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?].*)?$/i;

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Detecta cambios en `src` y decide si renderizar `<video>` o `<iframe>`.
   * @param changes Cambios detectados en inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.detectYoutube();
    }
  }

  /**
   * Comprueba si `src` es enlace YouTube. Si lo es, genera y sanitiza
   * la URL de embed con parámetros (autoplay, loop, mute).
   * Caso contrario, prepara el componente para HTML5.
   */
  private detectYoutube(): void {
    if (!this.src) {
      this.isYoutube = false;
      this.youtubeEmbedUrl = undefined;
      return;
    }

    const match = this.src.match(this.youtubePattern);
    if (match) {
      const id = match[1];
      const params = new URLSearchParams();
      if (this.autoplay) params.set('autoplay', '1');
      if (this.loop) {
        params.set('loop', '1');
        params.set('playlist', id);
      }
      if (this.muted) params.set('mute', '1');

      const embedUrl = `https://www.youtube.com/embed/${id}${
        params.toString() ? '?' + params.toString() : ''
      }`;
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        embedUrl
      );
      this.isYoutube = true;
    } else {
      this.isYoutube = false;
      this.youtubeEmbedUrl = undefined;
    }
  }

  /**
   * Inicia la reproducción del `<video>` quitando el poster y
   * lanzando `play()`. Actualiza `isPlaying`.
   */
  onPlay(): void {
    const video = this.videoRef?.nativeElement;
    if (video && !this.isPlaying) {
      video.removeAttribute('poster');
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => { /* ignore */ });
      }
      this.isPlaying = true;
    }
  }

  /**
   * Pausa el `<video>` y actualiza `isPlaying`.
   */
  onPause(): void {
    const video = this.videoRef?.nativeElement;
    if (video && this.isPlaying) {
      video.pause();
      this.isPlaying = false;
    }
  }
}
