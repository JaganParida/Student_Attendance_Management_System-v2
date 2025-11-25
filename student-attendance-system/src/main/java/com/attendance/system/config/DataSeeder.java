package com.attendance.system.config;

import com.attendance.system.entity.User;
import com.attendance.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            if (!userRepository.existsByEmail("admin@gmail.com")) {

                User admin = new User();
                admin.setName("Administrator");
                admin.setEmail("admin@gmail.com");
                admin.setPassword("admin123"); // Plain text (NoOpPasswordEncoder)
                admin.setRole(User.Role.ADMIN);

                userRepository.save(admin);

                System.out.println("✅ Default Admin Created");
            }
        };
    }
}
