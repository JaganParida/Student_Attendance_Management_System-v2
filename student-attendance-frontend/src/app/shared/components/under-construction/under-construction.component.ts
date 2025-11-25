import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './under-construction.component.html',
})
export class UnderConstructionComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
