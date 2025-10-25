package com.cheerain.service;

import com.cheerain.entity.Venue;
import com.cheerain.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public Optional<Venue> verifyVenueCode(String code) {
        return venueRepository.findByCode(code)
                .filter(Venue::isValid);
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
