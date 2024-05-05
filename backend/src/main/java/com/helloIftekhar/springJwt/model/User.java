package com.helloIftekhar.springJwt.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "user")
@Getter
@Setter
public class User implements UserDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "first_name")
    private String firstName;
    @Column(name = "email", unique = true) // Make email field unique
    private String  email;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT NULL")
    private Boolean status; // Default null
    @Column(name = "username")
    private String username;
    private String resetToken;
    private String resetTokenEmail;
    private LocalDateTime dateToken;
    @Column(name = "password")
    private String password;
    private String photos;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    @Column(name = "verification_code")
    private String verificationCode; // Attribute for code verification

    @Column(name = "email_verified")
    private boolean emailVerified; // Attribute for email verification status

    @OneToMany(mappedBy = "user")
    private List<Token> tokens;

    @JsonBackReference
    @OneToMany(mappedBy = "user")
    private List<Reservation> reservations;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.username;
	}
}
