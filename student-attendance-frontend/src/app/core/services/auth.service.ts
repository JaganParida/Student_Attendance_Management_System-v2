import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// 1. --- ADD THESE IMPORTS ---
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  LoginRequest,
  SignupRequest,
  JwtResponse,
  UserInfoResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // 2. --- ADD THESE PROPERTIES ---
  // A BehaviorSubject holds the current user value
  private currentUserSubject: BehaviorSubject<UserInfoResponse | null>;
  // Expose the user as a public observable for other components
  public currentUser: Observable<UserInfoResponse | null>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // 3. --- INITIALIZE THE SUBJECT ---
    // On app start, get the user from local storage
    const storedUser = this.storageService.getUser();
    this.currentUserSubject = new BehaviorSubject<UserInfoResponse | null>(
      storedUser
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // 4. --- ADD A PUBLIC GETTER for the current value ---
  public get currentUserValue(): UserInfoResponse | null {
    return this.currentUserSubject.value;
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response) => {
          // 5. --- CREATE USER OBJECT & NOTIFY SUBSCRIBERS ---
          // Create the user object to store
          const user: UserInfoResponse = {
            id: response.id,
            email: response.email,
            name: response.name,
            role: response.role,
            // Add any other fields from UserInfoResponse if they exist in JwtResponse
          };

          // Save to storage
          this.storageService.setToken(response.token);
          this.storageService.setUser(user);

          // Notify all subscribers (like the sidebar) that the user has changed
          this.currentUserSubject.next(user);
        })
      );
  }

  register(signupRequest: SignupRequest): Observable<UserInfoResponse> {
    return this.http.post<UserInfoResponse>(
      `${this.apiUrl}/register`,
      signupRequest
    );
  }

  getCurrentUser(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  logout(): void {
    this.storageService.clear();
    // 6. --- NOTIFY SUBSCRIBERS OF LOGOUT ---
    // Notify all subscribers that the user is now null
    this.currentUserSubject.next(null);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  isAuthenticated(): boolean {
    return this.storageService.isLoggedIn();
  }

  getCurrentUserRole(): string | null {
    return this.storageService.getUserRole();
  }

  getStoredUser(): any {
    return this.storageService.getUser();
  }
}
