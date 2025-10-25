package com.cheerain.repository;

import com.cheerain.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
    List<Match> findAllByOrderByMatchDateDesc();
    List<Match> findByCompetitionOrderByMatchDateDesc(String competition);
    List<Match> findByRoundOrderByMatchDate(Integer round);
}
