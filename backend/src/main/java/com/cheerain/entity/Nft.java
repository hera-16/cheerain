package com.cheerain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "nfts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nft {

    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "player_name", nullable = false, length = 100)
    private String playerName;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "creator_uid", nullable = false, length = 36)
    private String creatorUid;

    @Column(name = "creator_user_id", nullable = false, length = 50)
    private String creatorUserId;

    @Column(name = "creator_email", nullable = false)
    private String creatorEmail;

    @Column(name = "payment_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "venue_id", length = 5)
    private String venueId;

    @Column(name = "is_venue_attendee")
    private Boolean isVenueAttendee = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentMethod {
        CREDIT, PAYPAY, AUPAY
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.isVenueAttendee == null) {
            this.isVenueAttendee = this.venueId != null && !this.venueId.isEmpty();
        }
    }
}
