package com.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="`order`")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long orderId;
	@ManyToOne
	@JoinColumn(name = "userId")
	private User user;
	@OneToMany(mappedBy="order",cascade=CascadeType.ALL)
	private List<OrderItem> orderItems=new ArrayList<>();
	private double totalPrice;
	private String shippingAddress;
	private String orderStatus;
	private String razorPayOrderId;
	private String paymentId;
	private String paymentStatus;
	private LocalDateTime orderDate=LocalDateTime.now();
	
	@PrePersist
	@PreUpdate
	void update() {
		totalPrice=0;
		for(OrderItem oi:orderItems) {
			totalPrice+=oi.getTotalPrice();
		}
	}
}
