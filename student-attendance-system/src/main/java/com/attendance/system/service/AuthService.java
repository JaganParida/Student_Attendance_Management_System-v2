package com.attendance.system.service;

import com.attendance.system.dto.request.LoginRequest;
import com.attendance.system.dto.request.SignupRequest;
import com.attendance.system.dto.response.JwtResponse;
import com.attendance.system.dto.response.UserInfoResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    UserInfoResponse registerUser(SignupRequest signUpRequest);
    UserInfoResponse getCurrentUserInfo(Long userId);
}