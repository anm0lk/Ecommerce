package com.ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDTO {
	private Long orderId;
	private LocalDateTime orderDate;
	private double totalPrice;
	private String orderStatus;
	private String shippingAddress;
	private String paymentStatus;
	private Long userId;
	private String userName;
	private String userEmail;
	private List<OrderItemDTO> orderItems;
	
}
