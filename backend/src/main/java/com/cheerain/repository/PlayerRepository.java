package com.cheerain.repository;

import com.cheerain.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {
    List<Player> findByIsActiveTrueOrderByNumberAsc();
    List<Player> findAllByOrderByNumberAsc();
    boolean existsByNumber(Integer number);
}
