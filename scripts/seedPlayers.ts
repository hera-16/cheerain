import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.localファイルを読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Firebase設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCZSHc4LdrxVAwddOfB7hkkQ2lKnTZhjpc',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'cheerain-2a4b8.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'cheerain-2a4b8',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'cheerain-2a4b8.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '380830578407',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:380830578407:web:0749b94e2299a7b08b9442',
};

console.log('🔧 Firebase設定:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ギラヴァンツ北九州 2025年選手データ
const players = [
  // ゴールキーパー
  { id: 'gk-1', name: '伊藤剛', number: 1, position: 'GK' },
  { id: 'gk-27', name: '田中悠也', number: 27, position: 'GK' },
  { id: 'gk-31', name: '大谷幸輝', number: 31, position: 'GK' },
  { id: 'gk-39', name: '杉本光希', number: 39, position: 'GK' },

  // ディフェンダー
  { id: 'df-4', name: '長谷川光基', number: 4, position: 'DF' },
  { id: 'df-13', name: '東廉太', number: 13, position: 'DF' },
  { id: 'df-22', name: '山脇樺織', number: 22, position: 'DF' },
  { id: 'df-42', name: '世良務', number: 42, position: 'DF' },
  { id: 'df-44', name: '辻岡佑真', number: 44, position: 'DF' },
  { id: 'df-50', name: '杉山耕二', number: 50, position: 'DF' },
  { id: 'df-76', name: '坂本稀吏也', number: 76, position: 'DF' },

  // ミッドフィルダー
  { id: 'mf-6', name: '星広太', number: 6, position: 'MF' },
  { id: 'mf-7', name: '平原隆暉', number: 7, position: 'MF' },
  { id: 'mf-8', name: '町田也真人', number: 8, position: 'MF' },
  { id: 'mf-11', name: '喜山康平', number: 11, position: 'MF' },
  { id: 'mf-14', name: '井澤春輝', number: 14, position: 'MF' },
  { id: 'mf-17', name: '岡野凜平', number: 17, position: 'MF' },
  { id: 'mf-20', name: '矢田旭', number: 20, position: 'MF' },
  { id: 'mf-21', name: '牛之濱拓', number: 21, position: 'MF' },
  { id: 'mf-24', name: '吉長真優', number: 24, position: 'MF' },
  { id: 'mf-28', name: '木實快斗', number: 28, position: 'MF' },
  { id: 'mf-32', name: '高柳郁弥', number: 32, position: 'MF' },
  { id: 'mf-34', name: '高吉正真', number: 34, position: 'MF' },
  { id: 'mf-66', name: '高橋大悟', number: 66, position: 'MF' },

  // フォワード
  { id: 'fw-9', name: '河辺駿太郎', number: 9, position: 'FW' },
  { id: 'fw-10', name: '永井龍', number: 10, position: 'FW' },
  { id: 'fw-18', name: '渡邉颯太', number: 18, position: 'FW' },
  { id: 'fw-19', name: '吉原楓人', number: 19, position: 'FW' },
  { id: 'fw-25', name: '坪郷来紀', number: 25, position: 'FW' },
  { id: 'fw-29', name: '高昇辰', number: 29, position: 'FW' },
  { id: 'fw-49', name: '駒沢直哉', number: 49, position: 'FW' },
  { id: 'fw-99', name: '樺山諒乃介', number: 99, position: 'FW' },
];

async function seedPlayers() {
  console.log('🌱 選手データの登録を開始します...');

  for (const player of players) {
    try {
      await setDoc(doc(db, 'players', player.id), {
        ...player,
        isActive: true,
        createdAt: new Date(),
      });
      console.log(`✅ ${player.name} (${player.position}${player.number}) を登録しました`);
    } catch (error) {
      console.error(`❌ ${player.name} の登録に失敗しました:`, error);
    }
  }

  console.log('🎉 選手データの登録が完了しました！');
  process.exit(0);
}

seedPlayers();
