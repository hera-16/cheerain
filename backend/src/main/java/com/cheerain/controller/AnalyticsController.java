package com.cheerain.controller;

import com.cheerain.dto.response.AnalyticsResponse;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        AnalyticsResponse analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
