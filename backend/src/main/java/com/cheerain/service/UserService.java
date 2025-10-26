package com.cheerain.service;

import com.cheerain.dto.response.UserResponse;
import com.cheerain.entity.User;
import com.cheerain.exception.ResourceNotFoundException;
import com.cheerain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateUserRole(String id, User.Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));

        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse updateProfileImage(String userId, String profileImageUrl) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));

        user.setProfileImage(profileImageUrl);
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }
}
