package com.ecommerce.config.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
//using aop to log
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Pointcut("within(@org.springframework.stereotype.Service *) || within(@org.springframework.web.bind.annotation.RestController *)")
	public void appBeans() {
	}

	@Before("appBeans()")
	public void logMethodEntry(JoinPoint joinPoint) {
		logger.info("Entering: {} with arguments {}", joinPoint.getSignature(), joinPoint.getArgs());
	}

	@AfterReturning(pointcut = "appBeans()", returning = "result")
	public void logMethodExit(JoinPoint joinPoint, Object result) {
		logger.info("Exiting: {} with result {}", joinPoint.getSignature(), result);
	}

	@AfterThrowing(pointcut = "appBeans()", throwing = "e")
	public void logException(JoinPoint joinPoint, Throwable e) {
		logger.error("Exception in: {} with message {}", joinPoint.getSignature(), e.getMessage());
	}
}
