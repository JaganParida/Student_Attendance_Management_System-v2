package com.attendance.system.dto.response;

public class JwtResponse {

    private String token;
    private String type;
    private Long id;
    private String email;
    private String name;
    private String role;

    public JwtResponse(String token, String type, Long id, String email, String name, String role) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getType() { return type; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
}
