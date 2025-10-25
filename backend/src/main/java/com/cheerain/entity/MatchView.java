package com.cheerain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_views")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchView {
    @Id
    private String id;

    @Column(name = "match_id", nullable = false)
    private String matchId;

    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (viewedAt == null) {
            viewedAt = LocalDateTime.now();
        }
    }
}
