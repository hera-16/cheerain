const functions = require('firebase-functions');
const admin = require('firebase-admin');

// 初期化
try {
  admin.initializeApp();
} catch (e) {
  // 再初期化を防止（エミュレータ等で2回読まれる場合があるため）
  console.log('admin already initialized');
}

const db = admin.firestore();

// 期限切れの venueCodes ドキュメントを毎時削除するスケジュール関数
exports.deleteExpiredVenueCodes = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    console.log('Running scheduled deletion for expired venueCodes');
    const now = admin.firestore.Timestamp.now();
    try {
      const snap = await db.collection('venueCodes').where('expiresAt', '<=', now).get();
      if (snap.empty) {
        console.log('No expired venueCodes found.');
        return null;
      }

      // Firestore のバッチは 500 書き込みまで。分割して実行。
      const docs = snap.docs.slice();
      let deleted = 0;
      while (docs.length > 0) {
        const chunk = docs.splice(0, 500);
        const batch = db.batch();
        chunk.forEach(d => batch.delete(d.ref));
        await batch.commit();
        deleted += chunk.length;
      }

      console.log(`Deleted ${deleted} expired venueCodes.`);
      return null;
    } catch (err) {
      console.error('Error deleting expired venueCodes:', err);
      return null;
    }
  });
