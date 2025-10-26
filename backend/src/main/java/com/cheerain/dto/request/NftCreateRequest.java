package com.cheerain.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class NftCreateRequest {
    @NotBlank(message = "タイトルは必須です")
    private String title;

    @NotBlank(message = "メッセージは必須です")
    private String message;

    @NotBlank(message = "選手名は必須です")
    private String playerName;

    private String imageUrl;

    @NotNull(message = "支払金額は必須です")
    @DecimalMin(value = "500", message = "支払金額は500円以上である必要があります")
    private BigDecimal paymentAmount;

    @NotBlank(message = "支払方法は必須です")
    @Pattern(regexp = "CREDIT|PAYPAY|AUPAY", message = "支払方法が不正です")
    private String paymentMethod;

    @Pattern(regexp = "^\\d{5}$|^$", message = "会場IDは5桁の数字である必要があります")
    private String venueId;
}
