package com.attendance.system.service.impl;

import com.attendance.system.entity.User;
import com.attendance.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        return new UserDetailsImpl(user);
    }

    public static class UserDetailsImpl implements UserDetails {
        private static final long serialVersionUID = 1L;
        private Long id;
        private String email;
        private String password;
        private Collection<? extends GrantedAuthority> authorities;

        public UserDetailsImpl(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.password = user.getPassword();
            this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        public Long getId() { 
            return id; 
        }
        
        public String getEmail() { 
            return email; 
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() { 
            return password; 
        }
        
        @Override
        public String getUsername() { 
            return email; 
        }
        
        @Override
        public boolean isAccountNonExpired() { 
            return true; 
        }
        
        @Override
        public boolean isAccountNonLocked() { 
            return true; 
        }
        
        @Override
        public boolean isCredentialsNonExpired() { 
            return true; 
        }
        
        @Override
        public boolean isEnabled() { 
            return true; 
        }
    }
}