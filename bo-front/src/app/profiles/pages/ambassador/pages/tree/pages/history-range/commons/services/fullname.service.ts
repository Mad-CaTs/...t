import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullNameService {
  public readonly fullName: string = 'Omar Urteaga';
}
