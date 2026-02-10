package com.ecommerce.controller;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.RazorpayService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private RazorpayService razorpayService;
    private OrderService orderService;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    public PaymentController(RazorpayService razorpayService,OrderService orderService){
        this.razorpayService=razorpayService;
        this.orderService=orderService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String,Object>> createOrder(@RequestParam int amount, @RequestParam String currency, @RequestParam String receipt, @RequestBody String address){
        try{
            address=address.replaceAll("\"","");
            Order order=razorpayService.createOrder(amount, currency, receipt);
            String razorpayOrderId=order.get("id");
            OrderDTO orderDb = orderService.placeOrder(Long.valueOf(receipt),address);
            return getMapResponseEntity(amount, currency, razorpayOrderId, orderDb);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error",e.getMessage()));
        }
    }

    @PostMapping("/create-order-product")
    public ResponseEntity<Map<String,Object>> createOrderProduct(@RequestParam int amount, @RequestParam String currency, @RequestParam String receipt, @RequestParam String productId, @RequestBody String address){
        try{
            address=address.replaceAll("\"","");
            Order order=razorpayService.createOrder(amount, currency, receipt);
            String razorpayOrderId=order.get("id");
            OrderDTO orderDb = orderService.placeProductOrder(Long.valueOf(receipt),Long.valueOf(productId),address);
            return getMapResponseEntity(amount, currency, razorpayOrderId, orderDb);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error",e.getMessage()));
        }
    }

    private ResponseEntity<Map<String, Object>> getMapResponseEntity(int amount,String currency, String razorpayOrderId, OrderDTO orderDb) {
        orderService.attachRazorpayOrderId(orderDb.getOrderId().toString(), razorpayOrderId);
        Map<String,Object>map=new HashMap<>();
        map.put("id",razorpayOrderId);
        map.put("amount",amount);
        map.put("currency",currency);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,@RequestHeader("X-Razorpay-Signature") String signature){
        try{
            Mac sha256_HMAC= Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key=new SecretKeySpec(webhookSecret.getBytes(),"HmacSHA256");
            sha256_HMAC.init(secret_key);
            String hash= Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(payload.getBytes()));

//             if(!hash.equals(signature)){
//                 return ResponseEntity.status(400).body("Invalid signature");
//             }

            ObjectMapper mapper=new ObjectMapper();
            JsonNode root=mapper.readTree(payload);
            String event = root.path("event").asText();
            String paymentId = root.path("payload").path("payment").path("entity").path("id").asText();
            String orderId = root.path("payload").path("payment").path("entity").path("order_id").asText();
            if("payment.captured".equals(event)){
                orderService.updatePaymentDetailsByRazorPayOrderId(orderId,paymentId,"PROCESSING");
            }
            if("order.paid".equals(event)){
                orderService.updatePaymentDetailsByRazorPayOrderId(orderId,paymentId,"PAID");
            }
            if("payment.failed".equals(event)){
                orderService.removeOrderByRazorpayOrderId(orderId);
            }
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing webhook");
        }
    }
}
