package com.ontech.OBS.auth;

import com.ontech.OBS.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  @NotEmpty(message = "firstname cannot be empty")
  private String firstname;
  @NotEmpty(message = "Lastname cannot be empty")
  private String lastname;

  private String email;
  @NotEmpty(message = "Password cannot be empty")
  private String password;

  private Role role;

  private boolean mfaEnabled;
}
