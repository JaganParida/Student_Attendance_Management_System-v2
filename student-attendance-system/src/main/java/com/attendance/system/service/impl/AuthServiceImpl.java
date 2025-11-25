package com.attendance.system.service.impl;

import com.attendance.system.config.JwtUtils;
import com.attendance.system.dto.request.LoginRequest;
import com.attendance.system.dto.request.SignupRequest;
import com.attendance.system.dto.response.JwtResponse;
import com.attendance.system.dto.response.UserInfoResponse;
import com.attendance.system.entity.*; // This import is correct
import com.attendance.system.repository.*;
import com.attendance.system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateTokenFromEmail(user.getEmail());

        return new JwtResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );
    }

    @Override
    @Transactional
    public UserInfoResponse registerUser(SignupRequest signUpRequest) {

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user;
        switch (signUpRequest.getRole().toUpperCase()) {

            case "ADMIN":
                Admin admin = new Admin(signUpRequest.getEmail(),
                        passwordEncoder.encode(signUpRequest.getPassword()),
                        signUpRequest.getName());
                admin.setAdminId(signUpRequest.getAdminId());
                admin.setPhone(signUpRequest.getPhone());
                
                // --- THIS IS THE CORRECT SYNTAX ---
                admin.setRole(User.Role.ADMIN);
                
                user = userRepository.save(admin);
                break;

            case "TEACHER":
                Teacher teacher = new Teacher(signUpRequest.getEmail(),
                        passwordEncoder.encode(signUpRequest.getPassword()),
                        signUpRequest.getName(),
                        signUpRequest.getTeacherId());
                teacher.setDepartment(signUpRequest.getDepartment());
                teacher.setPhone(signUpRequest.getPhone());
                
                // --- THIS IS THE CORRECT SYNTAX ---
                teacher.setRole(User.Role.TEACHER);
                
                user = userRepository.save(teacher);
                break;

            case "STUDENT":
                Student student = new Student(signUpRequest.getEmail(),
                        passwordEncoder.encode(signUpRequest.getPassword()),
                        signUpRequest.getName(),
                        signUpRequest.getRollNumber(),
                        signUpRequest.getParentEmail());
                student.setPhone(signUpRequest.getPhone());

                // --- THIS IS THE CORRECT SYNTAX ---
                student.setRole(User.Role.STUDENT);

                if (signUpRequest.getClassId() != null) {
                    ClassEntity classEntity = classRepository.findById(signUpRequest.getClassId())
                            .orElseThrow(() -> new RuntimeException("Class not found"));
                    student.setClassEntity(classEntity);
                }
                user = userRepository.save(student);
                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        return getCurrentUserInfo(user.getId());
    }

    @Override
    public UserInfoResponse getCurrentUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserInfoResponse response = new UserInfoResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());

        if (user instanceof Admin admin) {
            response.setAdminId(admin.getAdminId());
        } else if (user instanceof Teacher teacher) {
            response.setTeacherId(teacher.getTeacherId());
            response.setDepartment(teacher.getDepartment());
        } else if (user instanceof Student student) {
            response.setRollNumber(student.getRollNumber());
            response.setParentEmail(student.getParentEmail());
            if (student.getClassEntity() != null) {
                UserInfoResponse.ClassInfo classInfo = new UserInfoResponse.ClassInfo(
                        student.getClassEntity().getId(),
                        student.getClassEntity().getClassName(),
                        student.getClassEntity().getSection(),
                        student.getClassEntity().getAcademicYear()
                );
                response.setClassInfo(classInfo);
            }
        }

        return response;
    }
}