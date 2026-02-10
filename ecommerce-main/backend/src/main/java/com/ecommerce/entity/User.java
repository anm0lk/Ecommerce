package com.ecommerce.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	@Column(unique = true)
	private String email;
	private String password;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
//	Specific to users
	private String shippingAddress;
	private String paymentDetails;
	
	@ToString.Exclude
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL,orphanRemoval=true)
	private List<CartItem> cartItems=new ArrayList<>();
	@ToString.Exclude
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL,orphanRemoval = true)
	private List<Order> orders=new ArrayList<>();
}
