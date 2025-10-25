package com.cheerain.dto.response;

import com.cheerain.entity.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {
    private String id;
    private String name;
    private Integer number;
    private String position;
    private Boolean isActive;

    public static PlayerResponse from(Player player) {
        return new PlayerResponse(
                player.getId(),
                player.getName(),
                player.getNumber(),
                player.getPosition().name(),
                player.getIsActive()
        );
    }
}
