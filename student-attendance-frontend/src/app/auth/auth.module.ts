import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthRoutingModule],
})
export class AuthModule {}
