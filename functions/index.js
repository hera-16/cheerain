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

    // Callable function to verify a submitted code against the active admin code
    exports.verifyVenueCode = functions.https.onCall(async (data, context) => {
      const inputCode = (data && data.code) ? String(data.code).trim() : '';
      if (!inputCode) {
        return { match: false, reason: 'no-code' };
      }

      try {
        const now = admin.firestore.Timestamp.now();
        // Find latest non-expired venue code (order by createdAt desc)
        const snap = await db.collection('venueCodes').orderBy('createdAt', 'desc').limit(10).get();
        if (snap.empty) {
          return { match: false, reason: 'no-active-code' };
        }

        // pick first non-expired document
        for (const d of snap.docs) {
          const dataDoc = d.data();
          const expiresAt = dataDoc.expiresAt;
          // if expiresAt is missing treat as non-matching
          if (!expiresAt) continue;
          if (expiresAt.toMillis && expiresAt.toMillis() <= now.toMillis()) {
            // expired, skip
            continue;
          }
          const storedCode = String(dataDoc.code || '').trim();
          const venueName = dataDoc.venueName || null;
          if (!storedCode) continue;
          const match = storedCode === inputCode;
          return { match, venueName };
        }

        return { match: false, reason: 'no-active-code' };
      } catch (err) {
        console.error('verifyVenueCode error:', err);
        return { match: false, reason: 'internal-error' };
      }
    });
