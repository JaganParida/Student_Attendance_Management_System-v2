package com.attendance.system.service;

import com.attendance.system.entity.User;
import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    User save(User user);
    Optional<User> findById(Long id);
    User updateProfile(Long userId, String name, String phone);
    void changePassword(Long userId, String newPassword);
}