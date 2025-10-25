package com.cheerain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRankingResponse {
    private String playerName;
    private Long nftCount;
    private Integer rank;
}
