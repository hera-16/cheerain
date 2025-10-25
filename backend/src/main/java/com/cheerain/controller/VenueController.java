package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.entity.Venue;
import com.cheerain.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyVenueCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");

        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("BAD_REQUEST", "会場コードを入力してください"));
        }

        Optional<Venue> venue = venueService.verifyVenueCode(code);

        Map<String, Object> response = new HashMap<>();
        response.put("match", venue.isPresent());
        venue.ifPresent(v -> response.put("venueName", v.getName()));

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
