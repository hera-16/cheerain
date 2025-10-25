package com.cheerain.controller;

import com.cheerain.dto.request.NftCreateRequest;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.NftResponse;
import com.cheerain.service.NftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/nfts")
@RequiredArgsConstructor
public class NftController {

    private final NftService nftService;

    @PostMapping
    public ResponseEntity<ApiResponse<NftResponse>> createNft(
            @Valid @RequestBody NftCreateRequest request,
            Authentication authentication) {
        NftResponse nft = nftService.createNft(request, authentication);
        return ResponseEntity.ok(ApiResponse.success(nft, "NFTを発行しました"));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<NftResponse>>> getAllNfts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NftResponse> nfts = nftService.getAllNfts(pageable);
        return ResponseEntity.ok(ApiResponse.success(nfts));
    }

    @GetMapping("/public/player/{playerName}")
    public ResponseEntity<ApiResponse<Page<NftResponse>>> getNftsByPlayer(
            @PathVariable String playerName,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NftResponse> nfts = nftService.getNftsByPlayerName(playerName, pageable);
        return ResponseEntity.ok(ApiResponse.success(nfts));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<NftResponse>>> getMyNfts(
            Authentication authentication,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NftResponse> nfts = nftService.getMyNfts(authentication, pageable);
        return ResponseEntity.ok(ApiResponse.success(nfts));
    }

    @GetMapping("/my/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getMyNftCount(Authentication authentication) {
        long count = nftService.countMyNfts(authentication);
        Map<String, Long> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NftResponse>> getNftById(@PathVariable String id) {
        NftResponse nft = nftService.getNftById(id);
        return ResponseEntity.ok(ApiResponse.success(nft));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteNft(@PathVariable String id) {
        nftService.deleteNft(id);
        return ResponseEntity.ok(ApiResponse.success(null, "NFTを削除しました"));
    }
}
