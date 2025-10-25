package com.cheerain.service;

import com.cheerain.dto.request.NftCreateRequest;
import com.cheerain.dto.response.NftResponse;
import com.cheerain.entity.Nft;
import com.cheerain.entity.User;
import com.cheerain.exception.ResourceNotFoundException;
import com.cheerain.repository.NftRepository;
import com.cheerain.repository.UserRepository;
import com.cheerain.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NftService {

    private final NftRepository nftRepository;
    private final UserRepository userRepository;
    private final ContentModerationService contentModerationService;

    @Transactional
    public NftResponse createNft(NftCreateRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));

        // コンテンツモデレーションチェック
        if (contentModerationService.checkTextContent(request.getTitle(), request.getMessage())) {
            throw new IllegalArgumentException("不適切な内容が含まれています。タイトルやメッセージに暴言や過度な批判的な表現が含まれていないか確認してください。");
        }

        Nft nft = new Nft();
        nft.setTitle(request.getTitle());
        nft.setMessage(request.getMessage());
        nft.setPlayerName(request.getPlayerName());
        nft.setImageUrl(request.getImageUrl());
        nft.setCreatorUid(user.getId());
        nft.setCreatorUserId(user.getUserId());
        nft.setCreatorEmail(user.getEmail());
        nft.setPaymentAmount(request.getPaymentAmount());
        nft.setPaymentMethod(Nft.PaymentMethod.valueOf(request.getPaymentMethod()));
        nft.setVenueId(request.getVenueId());

        Nft savedNft = nftRepository.save(nft);
        return NftResponse.fromEntity(savedNft);
    }

    @Transactional(readOnly = true)
    public Page<NftResponse> getAllNfts(Pageable pageable) {
        return nftRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(NftResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<NftResponse> getNftsByPlayerName(String playerName, Pageable pageable) {
        return nftRepository.findByPlayerNameOrderByCreatedAtDesc(playerName, pageable)
                .map(NftResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<NftResponse> getMyNfts(Authentication authentication, Pageable pageable) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return nftRepository.findByCreatorUidOrderByCreatedAtDesc(userDetails.getId(), pageable)
                .map(NftResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public NftResponse getNftById(String id) {
        Nft nft = nftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NFTが見つかりません"));
        return NftResponse.fromEntity(nft);
    }

    @Transactional(readOnly = true)
    public long countMyNfts(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return nftRepository.countByCreatorUid(userDetails.getId());
    }

    @Transactional
    public void deleteNft(String id) {
        Nft nft = nftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NFTが見つかりません"));
        nftRepository.delete(nft);
    }

    /**
     * 管理者用: すべてのNFTを取得
     */
    @Transactional(readOnly = true)
    public java.util.List<NftResponse> getAllNFTs() {
        return nftRepository.findAll().stream()
                .map(NftResponse::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 管理者用: NFTを削除
     */
    @Transactional
    public void deleteNFT(String id) {
        if (!nftRepository.existsById(id)) {
            throw new ResourceNotFoundException("NFTが見つかりません: " + id);
        }
        nftRepository.deleteById(id);
    }
}
