package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.entity.Product;
import com.ecommerce.exception.ProductNotFoundException;
import com.ecommerce.repository.ProductRepository;

@Service
public class ProductService {

	private final ProductRepository productRepository;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	public Product addProduct(Product product) {
		return productRepository.save(product);
	}

	public Product updateProduct(Long id, Product updatedProduct) {
		return productRepository.findById(id).map(product -> {
			if (updatedProduct != null) {
				if (updatedProduct.getName() != null) {
					product.setName(updatedProduct.getName());
				}
				if (updatedProduct.getDescription() != null) {
					product.setDescription(updatedProduct.getDescription());
				}
				if (updatedProduct.getCategory() != null) {
					product.setCategory(updatedProduct.getCategory());
				}
				if (updatedProduct.getImageUrl() != null) {
					product.setImageUrl(updatedProduct.getImageUrl());
				}
				if (updatedProduct.getPrice() != 0) {
					product.setPrice(updatedProduct.getPrice());
				}
			}
			return productRepository.save(product);
		}).orElseThrow(()->new ProductNotFoundException("Product not found"));
	}

	public void deleteProduct(Long id) {
		if(!productRepository.existsById(id)) {
			throw new ProductNotFoundException("Product not found");
		}
		productRepository.deleteById(id);
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id).orElseThrow(()->new ProductNotFoundException("Product not found"));
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public List<Product> getProductsByCategory(String category) {
		return productRepository.findByCategory(category);
	}

}
