package com.cheerain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "venues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 5)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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

    public boolean isValid() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        if (validFrom != null && now.isBefore(validFrom)) {
            return false;
        }

        if (validUntil != null && now.isAfter(validUntil)) {
            return false;
        }

        return true;
    }
}
