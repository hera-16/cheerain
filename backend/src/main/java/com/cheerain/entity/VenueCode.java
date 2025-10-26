package com.cheerain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "venue_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueCode {

    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "venue_name", length = 100)
    private String venueName;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.expiresAt == null) {
            // デフォルトで24時間後に期限切れ
            this.expiresAt = LocalDateTime.now().plusHours(24);
        }
    }
}
