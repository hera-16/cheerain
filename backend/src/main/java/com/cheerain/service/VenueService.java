package com.cheerain.service;

import com.cheerain.entity.Venue;
import com.cheerain.entity.VenueCode;
import com.cheerain.repository.VenueRepository;
import com.cheerain.repository.VenueCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final VenueCodeRepository venueCodeRepository;

    @Transactional(readOnly = true)
    public Optional<Venue> verifyVenueCode(String code) {
        // venue_codesテーブルでコードを検証
        Optional<VenueCode> venueCode = venueCodeRepository.findByCode(code);
        
        if (venueCode.isPresent()) {
            VenueCode vc = venueCode.get();
            // 期限切れチェック
            if (vc.getExpiresAt().isAfter(LocalDateTime.now())) {
                // venue_codesが有効な場合、venueオブジェクトを作成して返す
                Venue venue = Venue.builder()
                        .code(vc.getCode())
                        .name(vc.getVenueName())
                        .isActive(true)
                        .build();
                return Optional.of(venue);
            }
        }
        
        return Optional.empty();
    }

    @Transactional
    public Venue createVenue(String code, String name) {
        Venue venue = Venue.builder()
                .code(code)
                .name(name)
                .isActive(true)
                .build();
        return venueRepository.save(venue);
    }
}
