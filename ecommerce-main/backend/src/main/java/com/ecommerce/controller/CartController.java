package com.ecommerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.CartItem;
import com.ecommerce.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	private final CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	@PostMapping("/add")
	public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartItem cartItem) {
		CartItemDTO savedCartItem = cartService.addToCart(cartItem.getUser().getId(),
				cartItem.getProduct().getProductId(), cartItem.getQuantity());
		return ResponseEntity.ok(savedCartItem);
	}

	@DeleteMapping("/remove")
	public ResponseEntity<Void> removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
		cartService.removeFromCart(userId, productId);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/removeAll")
	public ResponseEntity<Void> removeAllFromCart(@RequestParam Long userId){
		cartService.removeCart(userId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/view/{userId}")
	public ResponseEntity<Map<String, Object>> viewCart(@PathVariable Long userId) {
		Map<String, Object> cartDetails = cartService.viewCart(userId);
		return ResponseEntity.ok(cartDetails);
	}
}
