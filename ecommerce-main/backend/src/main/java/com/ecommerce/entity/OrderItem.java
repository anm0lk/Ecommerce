package com.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Data
@Entity
public class OrderItem {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long orderItemId;
	@ManyToOne
	private Product product;
	private String productName;
	private String productImageUrl;
	private double productPrice;
	private int quantity;
	private double totalPrice;
	@ManyToOne
	private Order order;
	
	@PrePersist
	@PreUpdate
	void update() {
		if(quantity>0&productPrice>0)
			totalPrice=quantity*productPrice;
	}
}
