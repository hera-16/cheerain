package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.PlayerResponse;
import com.cheerain.entity.Player;
import com.cheerain.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerResponse>>> getAllPlayers() {
        List<PlayerResponse> players = playerService.getAllPlayers();
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/pageable")
    public ResponseEntity<ApiResponse<Page<PlayerResponse>>> getAllPlayersPageable(
            @PageableDefault(size = 20, sort = "number", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<PlayerResponse> players = playerService.getAllPlayers(pageable);
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PlayerResponse>>> getActivePlayers() {
        List<PlayerResponse> players = playerService.getActivePlayers();
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerResponse>> getPlayerById(@PathVariable String id) {
        PlayerResponse player = playerService.getPlayerById(id);
        return ResponseEntity.ok(ApiResponse.success(player));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PlayerResponse>> createPlayer(@RequestBody Player player) {
        PlayerResponse createdPlayer = playerService.createPlayer(player);
        return ResponseEntity.ok(ApiResponse.success(createdPlayer, "選手を登録しました"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PlayerResponse>> updatePlayer(
            @PathVariable String id,
            @RequestBody Player playerDetails) {
        PlayerResponse updatedPlayer = playerService.updatePlayer(id, playerDetails);
        return ResponseEntity.ok(ApiResponse.success(updatedPlayer, "選手情報を更新しました"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable String id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "選手を削除しました"));
    }
}
