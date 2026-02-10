package com.ecommerce.exception;

public class CartIsEmptyException extends RuntimeException {

	public CartIsEmptyException(String message) {
		super(message);
	}
}
