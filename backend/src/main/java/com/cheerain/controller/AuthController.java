package com.cheerain.controller;

import com.cheerain.dto.request.LoginRequest;
import com.cheerain.dto.request.RegisterRequest;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.LoginResponse;
import com.cheerain.dto.response.UserResponse;
import com.cheerain.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(user, "ユーザー登録が完了しました"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(loginResponse, "ログインに成功しました"));
    }
}
