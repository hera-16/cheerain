package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.UserResponse;
import com.cheerain.entity.User;
import com.cheerain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/user-id/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByUserId(@PathVariable String userId) {
        UserResponse user = userService.getUserByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable String id,
            @RequestParam User.Role role) {
        UserResponse user = userService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success(user, "ユーザー権限を更新しました"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "ユーザーを削除しました"));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String userId = authentication.getName();
        String profileImage = request.get("profileImage");

        if (profileImage == null || profileImage.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("BAD_REQUEST", "プロフィール画像URLが必要です"));
        }

        UserResponse user = userService.updateProfileImage(userId, profileImage);
        return ResponseEntity.ok(ApiResponse.success(user, "プロフィール画像を更新しました"));
    }
}
