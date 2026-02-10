package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
	public List<Order> findByUser(User user);
	public void removeByOrderId(Long orderId);
	public Optional<Order> findByRazorPayOrderId(String razorPayOrderId);
	public void removeByRazorPayOrderId(String razorPayOrderId);
}
