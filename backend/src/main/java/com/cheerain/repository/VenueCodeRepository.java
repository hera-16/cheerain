package com.cheerain.repository;

import com.cheerain.entity.VenueCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VenueCodeRepository extends JpaRepository<VenueCode, String> {
    Optional<VenueCode> findByCode(String code);
    List<VenueCode> findByExpiresAtAfter(LocalDateTime dateTime);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
