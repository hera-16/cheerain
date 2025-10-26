package com.cheerain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private Integer round; // 節

    @Column(nullable = false)
    private LocalDateTime matchDate; // 試合日時

    @Column(nullable = false, length = 50)
    private String homeTeam; // ホームチーム

    @Column(nullable = false, length = 50)
    private String awayTeam; // アウェイチーム

    @Column
    private Integer homeScore; // ホームスコア

    @Column
    private Integer awayScore; // アウェイスコア

    @Column(nullable = false, length = 10)
    private String location; // HOME/AWAY

    @Column(nullable = false, length = 100)
    private String stadium; // 会場

    @Column(length = 20)
    private String competition; // 大会名 (J3リーグ、天皇杯、ルヴァンカップ)

    @Column(length = 200)
    private String matchInfoUrl; // 試合情報URL

    @Column(length = 20)
    private String result; // 試合結果 (WIN/LOSE/DRAW/SCHEDULED)

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
