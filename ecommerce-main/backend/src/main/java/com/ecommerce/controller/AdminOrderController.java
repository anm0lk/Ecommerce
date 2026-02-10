package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

	private OrderService orderService;

	AdminOrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public ResponseEntity<List<OrderDTO>> getAllOrders() {
		return ResponseEntity.ok(orderService.viewAllOrders());
	}

	@PostMapping("/status/{orderId}")
	public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
	}

	@PostMapping("/payment/{orderId}")
	public ResponseEntity<OrderDTO> updatePaymentStatus(@PathVariable Long orderId, @RequestParam String payment) {
		return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, payment));
	}

	@DeleteMapping("/{orderId}")
	public ResponseEntity<Void> removeOrder(@PathVariable Long orderId) {
		orderService.removeOrder(orderId);
		return ResponseEntity.noContent().build();
	}
}
