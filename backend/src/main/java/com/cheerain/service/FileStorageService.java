package com.cheerain.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subDirectory) throws IOException {
        // ファイル名をユニークにする
        String originalFilename = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + "." + extension;

        // 保存先ディレクトリを作成
        Path uploadPath = Paths.get(uploadDir, subDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // ファイルを保存
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 相対パスを返す（URLとして使用）
        return "/" + subDirectory + "/" + filename;
    }

    public void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        // 先頭のスラッシュを除去
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }

        Path path = Paths.get(uploadDir, filePath);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

    public Path getFilePath(String filePath) {
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }
        return Paths.get(uploadDir, filePath);
    }
}
