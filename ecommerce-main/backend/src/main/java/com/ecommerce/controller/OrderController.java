package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders/{userId}")
public class OrderController {
	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@PostMapping
	public ResponseEntity<OrderDTO> placeOrder(@PathVariable Long userId, @RequestBody(required = false) String address) {
		OrderDTO placedOrder = orderService.placeOrder(userId,address);
		return new ResponseEntity<>(placedOrder, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<OrderDTO>> getAllOrders(@PathVariable Long userId) {
		List<OrderDTO> orders = orderService.getOrdersByUser(userId);
		return new ResponseEntity<>(orders, HttpStatus.OK);
	}
	
	@PostMapping("/{productId}")
	public ResponseEntity<OrderDTO> productOrder(@PathVariable Long userId,@PathVariable Long productId, @RequestBody(required = false) String address) {
		OrderDTO pdtOrder=orderService.placeProductOrder(userId,productId,address);
		return new ResponseEntity<>(pdtOrder,HttpStatus.CREATED);
	}

}
