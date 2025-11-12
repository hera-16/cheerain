package com.cheerain.service;

import com.cheerain.dto.request.NftCreateRequest;
import com.cheerain.dto.response.NftResponse;
import com.cheerain.entity.Nft;
import com.cheerain.entity.User;
import com.cheerain.exception.ResourceNotFoundException;
import com.cheerain.repository.NftRepository;
import com.cheerain.repository.UserRepository;
import com.cheerain.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NftService ユニットテスト")
class NftServiceTest {

    @Mock
    private NftRepository nftRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ContentModerationService contentModerationService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private NftService nftService;

    private NftCreateRequest nftCreateRequest;
    private User mockUser;
    private Nft mockNft;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        nftCreateRequest = new NftCreateRequest();
        nftCreateRequest.setTitle("応援メッセージ");
        nftCreateRequest.setMessage("頑張ってください!");
        nftCreateRequest.setPlayerName("選手名");
        nftCreateRequest.setImageUrl("https://example.com/image.png");
        nftCreateRequest.setPaymentAmount(new BigDecimal("1000"));
        nftCreateRequest.setPaymentMethod("CREDIT");
        nftCreateRequest.setVenueId("12345");

        mockUser = new User();
        mockUser.setId("user-uuid");
        mockUser.setUserId("user_12345");
        mockUser.setEmail("test@example.com");
        mockUser.setPasswordHash("encodedPassword");
        mockUser.setRole(User.Role.USER);
        mockUser.setPoints(100);

        mockNft = new Nft();
        mockNft.setId("nft-uuid");
        mockNft.setTitle("応援メッセージ");
        mockNft.setMessage("頑張ってください!");
        mockNft.setPlayerName("選手名");
        mockNft.setCreatorUid("user-uuid");
        mockNft.setCreatorUserId("user_12345");
        mockNft.setCreatorEmail("test@example.com");
        mockNft.setPaymentAmount(new BigDecimal("1000"));
        mockNft.setPaymentMethod(Nft.PaymentMethod.CREDIT);
        mockNft.setVenueId("12345");

        userDetails = UserDetailsImpl.build(mockUser);
    }

    @Test
    @DisplayName("正常なNFT作成ができること")
    void createNft_Success() {
        // Given
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(userDetails.getId())).thenReturn(Optional.of(mockUser));
        when(contentModerationService.checkTextContent(anyString(), anyString())).thenReturn(false);
        when(nftRepository.save(any(Nft.class))).thenReturn(mockNft);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // When
        NftResponse response = nftService.createNft(nftCreateRequest, authentication);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("応援メッセージ");
        assertThat(mockUser.getPoints()).isEqualTo(120); // 100 + 20ポイント(1000円)

        verify(contentModerationService).checkTextContent(nftCreateRequest.getTitle(), nftCreateRequest.getMessage());
        verify(nftRepository).save(any(Nft.class));
        verify(userRepository).save(mockUser);
    }

    @Test
    @DisplayName("不適切なコンテンツを含むNFT作成は例外が発生すること")
    void createNft_InappropriateContent_ThrowsException() {
        // Given
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(userDetails.getId())).thenReturn(Optional.of(mockUser));
        when(contentModerationService.checkTextContent(anyString(), anyString())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> nftService.createNft(nftCreateRequest, authentication))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("不適切な内容が含まれています");

        verify(nftRepository, never()).save(any());
    }

    @Test
    @DisplayName("存在しないユーザーでNFT作成を試みると例外が発生すること")
    void createNft_UserNotFound_ThrowsException() {
        // Given
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(userDetails.getId())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> nftService.createNft(nftCreateRequest, authentication))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("ユーザーが見つかりません");

        verify(nftRepository, never()).save(any());
    }

    @Test
    @DisplayName("高額支払い時に適切なポイントが付与されること")
    void createNft_HighPayment_CorrectPoints() {
        // Given
        nftCreateRequest.setPaymentAmount(new BigDecimal("3500")); // 3500円 → 100ポイント
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(userDetails.getId())).thenReturn(Optional.of(mockUser));
        when(contentModerationService.checkTextContent(anyString(), anyString())).thenReturn(false);
        when(nftRepository.save(any(Nft.class))).thenReturn(mockNft);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // When
        nftService.createNft(nftCreateRequest, authentication);

        // Then
        assertThat(mockUser.getPoints()).isEqualTo(200); // 100 + 100ポイント(3500円)
    }

    @Test
    @DisplayName("中額支払い時に適切なポイントが付与されること")
    void createNft_MediumPayment_CorrectPoints() {
        // Given
        nftCreateRequest.setPaymentAmount(new BigDecimal("1500")); // 1500円 → 50ポイント
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(userDetails.getId())).thenReturn(Optional.of(mockUser));
        when(contentModerationService.checkTextContent(anyString(), anyString())).thenReturn(false);
        when(nftRepository.save(any(Nft.class))).thenReturn(mockNft);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // When
        nftService.createNft(nftCreateRequest, authentication);

        // Then
        assertThat(mockUser.getPoints()).isEqualTo(150); // 100 + 50ポイント(1500円)
    }
}
