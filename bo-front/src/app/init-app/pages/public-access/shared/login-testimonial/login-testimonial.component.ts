import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-testimonial.component.html',
  styleUrl: './login-testimonial.component.scss'
})
export class LoginTestimonialComponent implements OnInit, OnDestroy {
  testimonials = [
    {
      quote:
        '“¡Porque InClub sí cumple! Nuestro evento Encumbra fue espectacular, y estoy contenta de pertenecer a esta empresa. ¡Por más proyectos!”',
      author: 'Mery Livias',
      affiliation: 'Afiliada desde 2020'
    },
    {
      quote:
        '“Mis expectativas eran altas, pero InClub me entregó más: eventos con impacto y conexiones que realmente suman, impulsando mi crecimiento profesional.”',
      author: 'Anónimo',
      affiliation: 'Afiliado desde 2022'
    },
    {
      quote:
        '“InClub me ha conectado con profesionales que me retan y me apoyan; es más que un club, es evolución y crecimiento, y fortalece mis habilidades día a día.”',
      author: 'Anónimo',
      affiliation: 'Afiliado desde 2022'
    }
  ];

  currentIndex = 0;
  private rotationId?: number;

  ngOnInit(): void {
    this.rotationId = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.rotationId) {
      clearInterval(this.rotationId);
    }
  }
}
