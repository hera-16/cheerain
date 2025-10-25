package com.cheerain.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * コンテンツモデレーションサービス
 * NGワード検出と不適切なコンテンツのチェック
 */
@Service
public class ContentModerationService {

    // NGワードリスト（選手への過度な批判や不適切な表現）
    private static final List<String> NG_WORDS = Arrays.asList(
        // 暴言・誹謗中傷
        "死ね", "しね", "クズ", "くず", "ゴミ", "ごみ", "カス", "かす",
        "バカ", "ばか", "アホ", "あほ", "馬鹿", "マヌケ", "まぬけ",
        "無能", "役立たず", "やめろ", "辞めろ", "引退しろ",

        // 差別的表現
        "差別", "ブス", "ブサイク", "デブ", "ハゲ", "チビ",

        // 過度な批判
        "最悪", "最低", "ダメ選手", "へた", "ヘタ", "下手くそ",
        "使えない", "いらない", "不要",

        // 暴力的表現
        "殺", "ぶっ", "蹴", "なぐ", "叩", "ボコボコ",

        // その他不適切
        "詐欺", "さぎ", "八百長", "やおちょう", "金返せ"
    );

    /**
     * テキストにNGワードが含まれているかチェック
     * @param text チェックするテキスト
     * @return NGワードが含まれていればtrue
     */
    public boolean containsNgWords(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }

        String lowerText = text.toLowerCase();

        for (String ngWord : NG_WORDS) {
            if (lowerText.contains(ngWord.toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    /**
     * タイトルとメッセージの両方をチェック
     * @param title タイトル
     * @param message メッセージ
     * @return NGワードが含まれていればtrue
     */
    public boolean checkTextContent(String title, String message) {
        return containsNgWords(title) || containsNgWords(message);
    }

    /**
     * NGワードをマスキングする（将来的な機能として）
     * @param text マスキングするテキスト
     * @return マスキングされたテキスト
     */
    public String maskNgWords(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        String result = text;
        for (String ngWord : NG_WORDS) {
            Pattern pattern = Pattern.compile(Pattern.quote(ngWord), Pattern.CASE_INSENSITIVE);
            result = pattern.matcher(result).replaceAll("***");
        }

        return result;
    }

    /**
     * 画像の基本チェック（ファイルサイズなど）
     * より高度なチェック（AI画像解析など）は将来的にCloud Vision APIなどで実装
     */
    public boolean isImageValid(byte[] imageData, long maxSizeInBytes) {
        if (imageData == null || imageData.length == 0) {
            return false;
        }

        // ファイルサイズチェック（デフォルト10MB）
        return imageData.length <= maxSizeInBytes;
    }
}
