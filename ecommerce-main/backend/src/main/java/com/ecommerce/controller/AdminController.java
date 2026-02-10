package com.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.UserDTO;
import com.ecommerce.entity.User;
import com.ecommerce.service.UserService;

@RestController
@RequestMapping("admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	@Autowired
	private UserService userService;

	@GetMapping("/users")
	public ResponseEntity<List<UserDTO>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping
	public ResponseEntity<List<UserDTO>> getAllAdmins() {
		return ResponseEntity.ok(userService.getAllAdmins());
	}

	@PostMapping("/register")
	public ResponseEntity<String> registerAdmin(@RequestBody User user) {
		return new ResponseEntity<>(userService.registerAdmin(user), HttpStatus.CREATED);
	}
	
	@DeleteMapping("/delete/{userId}")
	public void removeUser(@PathVariable Long userId) {
		userService.removeUser(userId);
	}
}
