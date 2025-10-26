package com.cheerain.dto.response;

import com.cheerain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String userId;
    private String email;
    private String role;
    private String profileImage;
    private Integer points;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(), // 大文字のまま返す (ADMIN, USER)
                user.getProfileImage(),
                user.getPoints(),
                user.getCreatedAt()
        );
    }

    public static UserResponse fromEntity(User user) {
        return from(user);
    }
}
