import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-serpost-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './serpost-option.component.html',
 styleUrls: ['./serpost-option.component.scss']
})
export class SerpostOptionComponent implements OnChanges {
/* 
  @Input() name!: string;
  @Input() address!: string; */
  @Input() selected: boolean = false;
  @Input() sucursal:any;
 @Output() optionClick = new EventEmitter<any>();

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sucursal'] && changes['sucursal'].currentValue) {
      console.log('Sucursal recibida en hijo (ngOnChanges):', changes['sucursal'].currentValue);
    }
  }

   onClick() {
    this.optionClick.emit(this.sucursal);
  }


}
