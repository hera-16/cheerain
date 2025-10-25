package com.cheerain.service;

import com.cheerain.dto.response.PlayerResponse;
import com.cheerain.entity.Player;
import com.cheerain.exception.ResourceNotFoundException;
import com.cheerain.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional(readOnly = true)
    public List<PlayerResponse> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(PlayerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PlayerResponse> getAllPlayers(Pageable pageable) {
        return playerRepository.findAll(pageable)
                .map(PlayerResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getActivePlayers() {
        return playerRepository.findByIsActiveTrueOrderByNumberAsc().stream()
                .map(PlayerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlayerResponse getPlayerById(String id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("選手が見つかりません"));
        return PlayerResponse.fromEntity(player);
    }

    @Transactional
    public PlayerResponse createPlayer(Player player) {
        Player savedPlayer = playerRepository.save(player);
        return PlayerResponse.fromEntity(savedPlayer);
    }

    @Transactional
    public PlayerResponse updatePlayer(String id, Player playerDetails) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("選手が見つかりません"));

        player.setName(playerDetails.getName());
        player.setNumber(playerDetails.getNumber());
        player.setPosition(playerDetails.getPosition());
        player.setIsActive(playerDetails.getIsActive());

        Player updatedPlayer = playerRepository.save(player);
        return PlayerResponse.fromEntity(updatedPlayer);
    }

    @Transactional
    public void deletePlayer(String id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("選手が見つかりません"));
        playerRepository.delete(player);
    }
}
