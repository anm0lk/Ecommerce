package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
	Optional<CartItem> findByUserAndProduct(User user,Product product);
	List<CartItem> findByUser(User user);
	void deleteAllByUserId(Long userId);
}
