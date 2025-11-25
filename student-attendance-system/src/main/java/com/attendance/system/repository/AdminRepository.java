package com.attendance.system.repository;

import com.attendance.system.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    // Useful for Login/Auth since email is unique in User table
    Optional<Admin> findByEmail(String email);

    // Find by specific Admin ID
    Optional<Admin> findByAdminId(String adminId);

    // Count active admins (active field inherited from User)
    Long countByActiveTrue();
}