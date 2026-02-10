package com.ecommerce.exception;

public class ItemNotInCartException extends RuntimeException {

	public ItemNotInCartException(String message) {
		super(message);
	}
}
