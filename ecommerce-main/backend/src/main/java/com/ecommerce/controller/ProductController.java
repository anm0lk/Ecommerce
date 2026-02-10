package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	private ProductService productService;

	ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping("/get")
	public ResponseEntity<List<Product>> getAllProducts() {
		return ResponseEntity.ok(productService.getAllProducts());
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getProductById(id));
	}

	@PostMapping("/add")
	public ResponseEntity<Product> createProduct(@RequestBody Product product) {

		return new ResponseEntity<>(productService.addProduct(product),HttpStatus.CREATED);
	}

	@PutMapping("/update")
	public ResponseEntity<Product> updateProduct(@RequestBody Product product) {
//		System.out.println(product.getProductId());
		return ResponseEntity.ok(productService.updateProduct(product.getProductId(), product));

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
		productService.deleteProduct(id);
		return ResponseEntity.ok().build();
	}
}
