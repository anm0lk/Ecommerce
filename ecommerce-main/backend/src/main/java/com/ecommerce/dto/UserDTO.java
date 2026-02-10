package com.ecommerce.dto;

import java.util.List;

import com.ecommerce.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
	private Long userId;
	private String name;
	private String email;
	private String password;
	private Role role;
	private String shippingAddress;
	private String paymentDetails;
	private List<CartItemDTO> cartItems;
	private List<OrderDTO> orders;
}
