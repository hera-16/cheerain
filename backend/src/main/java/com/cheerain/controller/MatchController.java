package com.cheerain.controller;

import com.cheerain.dto.request.MatchRequest;
import com.cheerain.dto.response.ApiResponse;
import com.cheerain.dto.response.MatchResponse;
import com.cheerain.dto.response.YearlyStatsResponse;
import com.cheerain.service.MatchService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getAllMatches(
            @RequestParam(required = false) String competition) {
        List<MatchResponse> matches;
        if (competition != null && !competition.isEmpty()) {
            matches = matchService.getMatchesByCompetition(competition);
        } else {
            matches = matchService.getAllMatches();
        }
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchResponse>> getMatchById(
            @PathVariable String id,
            HttpServletRequest request,
            Authentication authentication) {
        MatchResponse match = matchService.getMatchById(id);
        
        // 閲覧記録を保存
        String userId = authentication != null ? authentication.getName() : null;
        String ipAddress = getClientIpAddress(request);
        matchService.recordView(id, userId, ipAddress);
        
        return ResponseEntity.ok(ApiResponse.success(match));
    }

    // 年度別統計を取得
    @GetMapping("/stats/yearly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<YearlyStatsResponse>>> getYearlyStats() {
        List<YearlyStatsResponse> stats = matchService.getYearlyStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // 特定年度の統計を取得
    @GetMapping("/stats/yearly/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<YearlyStatsResponse>> getYearlyStatsByYear(@PathVariable int year) {
        YearlyStatsResponse stats = matchService.getYearlyStatsByYear(year);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // 試合の閲覧記録（一覧ページからの記録用）
    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<Void>> recordMatchView(
            @PathVariable String id,
            HttpServletRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        String ipAddress = getClientIpAddress(request);
        matchService.recordView(id, userId, ipAddress);
        return ResponseEntity.ok(ApiResponse.success(null, "閲覧を記録しました"));
    }

    // クライアントのIPアドレスを取得
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchResponse>> createMatch(@RequestBody MatchRequest request) {
        MatchResponse match = matchService.createMatch(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(match, "試合を作成しました"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchResponse>> updateMatch(
            @PathVariable String id,
            @RequestBody MatchRequest request) {
        MatchResponse match = matchService.updateMatch(id, request);
        return ResponseEntity.ok(ApiResponse.success(match, "試合を更新しました"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(@PathVariable String id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok(ApiResponse.success(null, "試合を削除しました"));
    }
}
