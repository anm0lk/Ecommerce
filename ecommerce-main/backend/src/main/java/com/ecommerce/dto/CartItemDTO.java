package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemDTO {
	private Long productId;
	private String productImageUrl;
	private String productName;
	private double productPrice;
	private int quantity;
	private double totalItemPrice;
	private Long userId;
	private String userName;
	private String userEmail;
}
