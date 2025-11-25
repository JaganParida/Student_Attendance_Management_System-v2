import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  clear(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
