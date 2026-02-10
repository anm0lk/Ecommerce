package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemDTO {
	private Long orderItemId;
	private String productName;
	private String productImageUrl;
	private double productPrice;
	private int quantity;
	private double totalPrice;
}
