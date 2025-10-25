package com.cheerain.dto.response;

import com.cheerain.entity.VenueCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueCodeResponse {
    private String id;
    private String code;
    private String venueName;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public static VenueCodeResponse fromEntity(VenueCode venueCode) {
        return new VenueCodeResponse(
                venueCode.getId(),
                venueCode.getCode(),
                venueCode.getVenueName(),
                venueCode.getCreatedBy(),
                venueCode.getCreatedAt(),
                venueCode.getExpiresAt()
        );
    }
}
