package com.cheerain.service;

import com.cheerain.dto.request.VenueCodeRequest;
import com.cheerain.dto.response.VenueCodeResponse;
import com.cheerain.entity.VenueCode;
import com.cheerain.exception.BadRequestException;
import com.cheerain.repository.VenueCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueCodeService {

    private final VenueCodeRepository venueCodeRepository;
    private final Random random = new Random();

    @Transactional
    public VenueCodeResponse createVenueCode(VenueCodeRequest request, String createdBy) {
        // 期限切れコードを削除
        venueCodeRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        // コードが指定されていない場合は5桁の数字を生成
        String code = request.getCode();
        if (code == null || code.trim().isEmpty()) {
            code = String.format("%05d", random.nextInt(100000));
        }

        // コードの重複チェック
        if (venueCodeRepository.findByCode(code).isPresent()) {
            throw new BadRequestException("このコードは既に使用されています");
        }

        VenueCode venueCode = new VenueCode();
        venueCode.setCode(code);
        venueCode.setVenueName(request.getVenueName());
        venueCode.setCreatedBy(createdBy);
        venueCode.setExpiresAt(LocalDateTime.now().plusHours(24));

        VenueCode saved = venueCodeRepository.save(venueCode);
        return VenueCodeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<VenueCodeResponse> getActiveVenueCodes() {
        // 期限切れでないコードのみを取得
        return venueCodeRepository.findByExpiresAtAfter(LocalDateTime.now())
                .stream()
                .map(VenueCodeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteVenueCode(String id) {
        venueCodeRepository.deleteById(id);
    }

    @Transactional
    public void deleteExpiredCodes() {
        venueCodeRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
