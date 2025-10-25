package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.NFTResponse;
import com.cheerain.service.NFTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/nfts")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class NFTAdminController {

    private final NFTService nftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NFTResponse>>> getAllNFTs() {
        List<NFTResponse> nfts = nftService.getAllNFTs();
        return ResponseEntity.ok(ApiResponse.success(nfts));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNFT(@PathVariable String id) {
        nftService.deleteNFT(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
