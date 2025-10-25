package com.cheerain.controller;

import com.cheerain.dto.request.VenueCodeRequest;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.VenueCodeResponse;
import com.cheerain.service.VenueCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/venue-codes")
@RequiredArgsConstructor
public class VenueCodeController {

    private final VenueCodeService venueCodeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VenueCodeResponse>> createVenueCode(
            @RequestBody VenueCodeRequest request,
            Authentication authentication) {
        String createdBy = authentication.getName();
        VenueCodeResponse response = venueCodeService.createVenueCode(request, createdBy);
        return ResponseEntity.ok(ApiResponse.success(response, "現地コードを作成しました"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VenueCodeResponse>>> getActiveVenueCodes() {
        List<VenueCodeResponse> codes = venueCodeService.getActiveVenueCodes();
        return ResponseEntity.ok(ApiResponse.success(codes));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVenueCode(@PathVariable String id) {
        venueCodeService.deleteVenueCode(id);
        return ResponseEntity.ok(ApiResponse.success(null, "現地コードを削除しました"));
    }
}
