package com.ecommerce.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.dto.OrderItemDTO;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.CartIsEmptyException;
import com.ecommerce.exception.OrderNotFoundException;
import com.ecommerce.exception.ProductNotFoundException;
import com.ecommerce.exception.UserNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@Service
public class OrderService {
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;

	public OrderService(OrderRepository orderRepository, UserRepository userRepository,
			CartItemRepository cartItemRepository, ProductRepository productRepository) {
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
	}

	public OrderDTO placeOrder(Long userId, String address) {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
		List<CartItem> cartItems = cartItemRepository.findByUser(user);
		if (cartItems.isEmpty()) {
			throw new CartIsEmptyException("Cart is empty");
		}

		Order order = new Order();
		order.setUser(user);

		List<OrderItem> orderItems = cartItems.stream().map(ci -> {
			OrderItem oi = new OrderItem();
			oi.setProduct(ci.getProduct());
			oi.setProductName(ci.getProduct().getName());
			oi.setProductImageUrl(ci.getProduct().getImageUrl());
			oi.setProductPrice(ci.getProduct().getPrice());
			oi.setQuantity(ci.getQuantity());
			oi.setTotalPrice(ci.getTotalPrice());
			oi.setOrder(order);
			return oi;
		}).collect(Collectors.toList());

		order.setOrderItems(orderItems);
		order.setTotalPrice(orderItems.stream().mapToDouble(OrderItem::getTotalPrice).sum());
		if(address!=null)
			order.setShippingAddress(address);
		else
			order.setShippingAddress(user.getShippingAddress());
		order.setOrderStatus("Pending");
		order.setPaymentStatus("UNPAID");
		Order savedOrder = orderRepository.save(order);
		cartItemRepository.deleteAll(cartItems);
		return convertToOrderDTO(savedOrder);
	}

	public OrderDTO placeProductOrder(Long userId, Long productId, String address) {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ProductNotFoundException("Product not found"));
		
		Order order = new Order();
		order.setUser(user);
		
		OrderItem oi=new OrderItem();
		oi.setProduct(product);
		oi.setProductName(product.getName());
		oi.setProductImageUrl(product.getImageUrl());
		oi.setProductPrice(product.getPrice());
		oi.setQuantity(1);
		oi.setTotalPrice(product.getPrice());
		oi.setOrder(order);
		
		List<OrderItem> orderItems=new ArrayList<>(Arrays.asList(oi));
		
		order.setOrderItems(orderItems);
		order.setTotalPrice(product.getPrice());
		if(address!=null)
			order.setShippingAddress(address);
		else
			order.setShippingAddress(user.getShippingAddress());
		order.setOrderStatus("Pending");
		order.setPaymentStatus("UNPAID");
		
		Order savedOrder=orderRepository.save(order);
		return convertToOrderDTO(savedOrder);
	}

	public OrderDTO convertToOrderDTO(Order order) {
		List<OrderItemDTO> item = order
				.getOrderItems().stream().map(oi -> new OrderItemDTO(oi.getOrderItemId(), oi.getProductName(),
						oi.getProductImageUrl(), oi.getProductPrice(), oi.getQuantity(), oi.getTotalPrice()))
				.collect(Collectors.toList());
		User user = order.getUser();
		return new OrderDTO(order.getOrderId(), order.getOrderDate(), order.getTotalPrice(), order.getOrderStatus(),
				order.getShippingAddress(), order.getPaymentStatus(), user.getId(), user.getName(), user.getEmail(),
				item);
	}

	public List<OrderDTO> getOrdersByUser(Long userId) {
		User user = userRepository.findById(userId).orElseThrow();
		List<Order> orders = orderRepository.findByUser(user);

		return orders.stream().map(this::convertToOrderDTO).collect(Collectors.toList());
	}

	public OrderDTO updateOrderStatus(Long orderId, String status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderNotFoundException("Order not found"));
		order.setOrderStatus(status);
		return convertToOrderDTO(orderRepository.save(order));
	}

	public OrderDTO updatePaymentStatus(Long orderId, String status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderNotFoundException("Order not found"));
		order.setPaymentStatus(status);
		return convertToOrderDTO(orderRepository.save(order));
	}

	public List<OrderDTO> viewAllOrders() {
		List<OrderDTO> orders = orderRepository.findAll().stream().map(this::convertToOrderDTO)
				.collect(Collectors.toList());
		return orders;
	}

	@Transactional
	public void removeOrder(Long orderId) {
		orderRepository.removeByOrderId(orderId);
	}

	@Transactional
	public void removeOrderByRazorpayOrderId(String razorPayOrderId) {
		orderRepository.removeByRazorPayOrderId(razorPayOrderId);
	}

	@Transactional
	public void attachRazorpayOrderId(String receipt,String razorPayOrderId){
		Order order=orderRepository.findById(Long.valueOf(receipt)).orElseThrow(()->new OrderNotFoundException("Order not found with id: "+receipt));
		order.setRazorPayOrderId(razorPayOrderId);
		orderRepository.save(order);
	}

	@Transactional
	public void updatePaymentDetailsByRazorPayOrderId(String razorPayOrderId,String paymentId, String paymentStatus){
		Order order=orderRepository.findByRazorPayOrderId(razorPayOrderId).orElseThrow(()->new OrderNotFoundException("Order not found for Razorpay order ID: "+razorPayOrderId));
		order.setPaymentId(paymentId);
		order.setPaymentStatus(paymentStatus);
		if(paymentStatus.equals("PAID")){
			order.setOrderStatus("ORDERED");
		}
		orderRepository.save(order);
	}

}
