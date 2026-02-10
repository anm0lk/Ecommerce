package com.ecommerce.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailPasswordInvalidException.class)
	public ResponseEntity<Object> handleEmailPasswordInvalid(EmailPasswordInvalidException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(CartIsEmptyException.class)
	public ResponseEntity<Object> handleCartIsEmpty(CartIsEmptyException e){
		return buildResponse(e.getMessage(),HttpStatus.NO_CONTENT);
	}
	
	@ExceptionHandler(ItemNotInCartException.class)
	public ResponseEntity<Object> handleItemNotInCart(ItemNotInCartException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(OrderNotFoundException.class)
	public ResponseEntity<Object> handleOrderNotFound(OrderNotFoundException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(ProductNotFoundException.class)
	public ResponseEntity<Object> handleProductNotFound(ProductNotFoundException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(UserAlreadyRegisteredException.class)
	public ResponseEntity<Object> handleUserAlreadyResgistered(UserAlreadyRegisteredException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<Object> handleUserNotFound(UserNotFoundException e){
		return buildResponse(e.getMessage(),HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleGenericException(Exception e){
		return buildResponse("Internal error: "+e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	private ResponseEntity<Object> buildResponse(String message,HttpStatus status){
		Map<String,Object> body=new HashMap<>();
		body.put("timestamp", LocalDateTime.now());
		body.put("status", status.value());
		body.put("error", status.getReasonPhrase());
		body.put("message", message);
		
		return new ResponseEntity<>(body,status);
	}
}
