import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { SignupRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  roles = ['STUDENT', 'TEACHER', 'ADMIN'];
  selectedRole = 'STUDENT';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      this.selectedRole = role;
      this.updateFormValidators();
    });
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      role: ['STUDENT', [Validators.required]],

      // Student specific
      rollNumber: [''],
      parentEmail: ['', [Validators.email]],
      classId: [null],

      // Teacher specific
      teacherId: [''],
      department: [''],

      // Admin specific
      adminId: [''],
    });

    this.updateFormValidators();
  }

  private updateFormValidators(): void {
    const rollNumberControl = this.registerForm.get('rollNumber');
    const parentEmailControl = this.registerForm.get('parentEmail');
    const teacherIdControl = this.registerForm.get('teacherId');
    const departmentControl = this.registerForm.get('department');
    const adminIdControl = this.registerForm.get('adminId');

    // Reset all validators
    [
      rollNumberControl,
      parentEmailControl,
      teacherIdControl,
      departmentControl,
      adminIdControl,
    ].forEach((control) => {
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    // Set validators based on role
    switch (this.selectedRole) {
      case 'STUDENT':
        rollNumberControl?.setValidators([Validators.required]);
        parentEmailControl?.setValidators([
          Validators.required,
          Validators.email,
        ]);
        break;
      case 'TEACHER':
        teacherIdControl?.setValidators([Validators.required]);
        departmentControl?.setValidators([Validators.required]);
        break;
      case 'ADMIN':
        adminIdControl?.setValidators([Validators.required]);
        break;
    }

    [
      rollNumberControl,
      parentEmailControl,
      teacherIdControl,
      departmentControl,
      adminIdControl,
    ].forEach((control) => {
      control?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const signupRequest: SignupRequest = this.registerForm.value;

      this.authService.register(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(
            'Registration successful! Please login.',
            'Close',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            }
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Registration failed. Please try again.',
            'Close',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get role() {
    return this.registerForm.get('role');
  }
  get rollNumber() {
    return this.registerForm.get('rollNumber');
  }
  get parentEmail() {
    return this.registerForm.get('parentEmail');
  }
  get teacherId() {
    return this.registerForm.get('teacherId');
  }
  get department() {
    return this.registerForm.get('department');
  }
  get adminId() {
    return this.registerForm.get('adminId');
  }
}
