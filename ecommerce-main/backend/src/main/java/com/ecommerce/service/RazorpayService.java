package com.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {
    private final RazorpayClient razorpayClient;

    public RazorpayService(@Value("${razorpay.key}")String key, @Value("${razorpay.secret}") String secret) throws Exception{
        this.razorpayClient=new RazorpayClient(key,secret);
    }

    public Order createOrder(int amount, String currency, String receipt) throws Exception{
        JSONObject orderRequest=new JSONObject();
        orderRequest.put("amount",amount*100);
        orderRequest.put("currency",currency);
        orderRequest.put("receipt",receipt);

        return razorpayClient.orders.create(orderRequest);
    }
}
