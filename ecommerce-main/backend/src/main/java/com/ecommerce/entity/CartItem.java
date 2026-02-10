package com.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Data
@Entity
public class CartItem {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long cartItemId;
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	@ManyToOne
	@JoinColumn(name="product_id")
	private Product product;
	
	private int quantity;
	private double totalPrice;
	
	@PrePersist
	@PreUpdate
	public void calculateTotalPrice() {
		if(product!=null&&quantity>0) {
			this.totalPrice=product.getPrice()*quantity;
		}
	}

}
