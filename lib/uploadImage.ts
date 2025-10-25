import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * 画像をFirebase Storageにアップロードし、ダウンロードURLを返す
 * @param file - アップロードする画像ファイル
 * @param path - Storageのパス（例: 'nfts/userId/fileName.jpg'）
 * @returns ダウンロードURL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    // Storage参照を作成
    const storageRef = ref(storage, path);

    // ファイルをアップロード
    const snapshot = await uploadBytes(storageRef, file);

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
}

/**
 * ファイル名を生成（ユニークなタイムスタンプ付き）
 * @param originalName - 元のファイル名
 * @returns ユニークなファイル名
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
}
