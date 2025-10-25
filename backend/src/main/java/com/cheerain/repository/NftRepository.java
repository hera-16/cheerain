package com.cheerain.repository;

import com.cheerain.entity.Nft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NftRepository extends JpaRepository<Nft, String> {
    Page<Nft> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Nft> findByPlayerNameOrderByCreatedAtDesc(String playerName, Pageable pageable);
    Page<Nft> findByCreatorUidOrderByCreatedAtDesc(String creatorUid, Pageable pageable);
    long countByCreatorUid(String creatorUid);

    // 統計クエリ
    @Query("SELECT n.playerName, COUNT(n) as count FROM Nft n GROUP BY n.playerName ORDER BY count DESC")
    List<Object[]> findPlayerRanking();

    @Query("SELECT n.paymentMethod, COUNT(n) FROM Nft n GROUP BY n.paymentMethod")
    List<Object[]> findPaymentMethodStats();

    @Query("SELECT COUNT(DISTINCT n.creatorUid) FROM Nft n")
    long countDistinctCreators();
}
