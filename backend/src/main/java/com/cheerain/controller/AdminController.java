package com.cheerain.controller;

import com.cheerain.dto.response.AnalyticsResponse;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.UserResponse;
import com.cheerain.service.AdminService;
import com.cheerain.service.AnalyticsService;
import com.cheerain.service.MatchSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AnalyticsService analyticsService;
    private final MatchSchedulerService matchSchedulerService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @RequestBody Map<String, String> updates) {
        UserResponse user = adminService.updateUser(id, updates);
        return ResponseEntity.ok(ApiResponse.success(user, "ユーザー情報を更新しました"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "ユーザーを削除しました"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        AnalyticsResponse analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @PostMapping("/matches/update")
    public ResponseEntity<ApiResponse<String>> updateMatchData() {
        matchSchedulerService.manualUpdate();
        return ResponseEntity.ok(ApiResponse.success("試合データの更新を開始しました"));
    }
}
