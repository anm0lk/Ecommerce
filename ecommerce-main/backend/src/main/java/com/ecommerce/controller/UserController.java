package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.UserDTO;
import com.ecommerce.entity.User;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.UserService;

import jakarta.persistence.EntityManager;

@RestController
@RequestMapping("/api/user")
public class UserController {
	private final UserService userService;
	private AuthenticationManager authenticationManager;
	private JwtService jwtService;
	private EntityManager entityManager;

	public UserController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService,
			EntityManager entityManager) {
		this.userService = userService;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.entityManager=entityManager;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> registerUser(@RequestBody User user) {
		userService.registerUser(user);
		entityManager.clear();
		return loginUser(user);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> loginUser(@RequestBody User user) {
//		System.out.println(user.getPassword());
		UserDTO obtainedUser = userService.getUserByEmail(user.getEmail());
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
		String token = jwtService.generateToken(obtainedUser);
		AuthResponse auth = new AuthResponse(token, obtainedUser, obtainedUser.getRole());
//		System.out.println(auth);
		return ResponseEntity.ok(auth);
	}

	@PutMapping("/update-user")
	public ResponseEntity<AuthResponse> updateUserDetails(@RequestBody User updatedUser) {
		UserDTO user = userService.updateUserProfile(updatedUser.getId(), updatedUser);
		String token = jwtService.generateToken(user);
		AuthResponse auth = new AuthResponse(token, user, user.getRole());
		return ResponseEntity.ok(auth);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDTO> getUserProfile(@PathVariable Long id) {
		UserDTO userDTO = userService.getUserProfile(id);
		return ResponseEntity.ok(userDTO);
	}
	
	@PostMapping("/register-admin")
	public ResponseEntity<String> registerAdmin(@RequestBody User user){
		String s=userService.registerAdmin(user);
		return ResponseEntity.ok(s);
	}

}
