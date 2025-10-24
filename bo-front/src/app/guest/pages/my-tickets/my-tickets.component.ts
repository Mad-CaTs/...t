import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'guest-my-tickets',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss'
})

export class MyTicketsComponent {}