package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.NftResponse;
import com.cheerain.service.NftService;
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

    private final NftService nftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NftResponse>>> getAllNFTs() {
        List<NftResponse> nfts = nftService.getAllNFTs();
        return ResponseEntity.ok(ApiResponse.success(nfts));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNFT(@PathVariable String id) {
        nftService.deleteNFT(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
