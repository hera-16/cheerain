package com.cheerain.repository;

import com.cheerain.entity.Nft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NftRepository extends JpaRepository<Nft, String> {
    Page<Nft> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Nft> findByPlayerNameOrderByCreatedAtDesc(String playerName, Pageable pageable);
    Page<Nft> findByCreatorUidOrderByCreatedAtDesc(String creatorUid, Pageable pageable);
    long countByCreatorUid(String creatorUid);
}
