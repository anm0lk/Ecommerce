package com.ecommerce.dto;

import com.ecommerce.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

	private String token;
	private UserDTO user;
	private Role role;
}
