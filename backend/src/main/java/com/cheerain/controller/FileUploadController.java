package com.cheerain.controller;

import com.cheerain.dto.response.ApiResponse;
import com.cheerain.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "general") String type) {
        try {
            // ファイルタイプの検証
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("BAD_REQUEST", "画像ファイルのみアップロード可能です"));
            }

            // ファイルサイズの検証（10MB以下）
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("BAD_REQUEST", "ファイルサイズは10MB以下にしてください"));
            }

            // ファイルを保存
            String subDirectory = switch (type) {
                case "nft" -> "nfts";
                case "profile" -> "profiles";
                default -> "general";
            };

            String filePath = fileStorageService.storeFile(file, subDirectory);

            Map<String, String> response = new HashMap<>();
            response.put("url", filePath);
            response.put("fileName", file.getOriginalFilename());

            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("INTERNAL_ERROR", "ファイルのアップロードに失敗しました: " + e.getMessage()));
        }
    }

    @GetMapping("/{type}/{filename:.+}")
    public ResponseEntity<byte[]> getFile(@PathVariable String type, @PathVariable String filename) {
        try {
            Path filePath = fileStorageService.getFilePath(type + "/" + filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
