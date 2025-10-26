package com.cheerain.dto.response;

import com.cheerain.entity.Nft;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NftResponse {
    private String id;
    private String title;
    private String message;
    private String playerName;
    private String imageUrl;
    private String creatorUid;
    private String creatorUserId;
    private String creatorAddress; // フロントエンド用
    private BigDecimal paymentAmount;
    private String paymentMethod;
    private String venueId;
    private Boolean isVenueAttendee;
    private LocalDateTime createdAt;

    public static NftResponse from(Nft nft) {
        return new NftResponse(
                nft.getId(),
                nft.getTitle(),
                nft.getMessage(),
                nft.getPlayerName(),
                nft.getImageUrl(),
                nft.getCreatorUid(),
                nft.getCreatorUserId(),
                nft.getCreatorEmail(), // creatorAddressとして返す
                nft.getPaymentAmount(),
                nft.getPaymentMethod().name(),
                nft.getVenueId(),
                nft.getIsVenueAttendee(),
                nft.getCreatedAt()
        );
    }

    public static NftResponse fromEntity(Nft nft) {
        return from(nft);
    }
}
