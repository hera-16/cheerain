import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 CheeRainNFTコントラクトをデプロイ中...");

  // デプロイアカウントの取得
  const [deployer] = await ethers.getSigners();
  console.log("📝 デプロイアカウント:", deployer.address);

  // デプロイアカウントの残高確認
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 アカウント残高:", ethers.formatEther(balance), "MATIC");

  // コントラクトのデプロイ
  const CheeRainNFT = await ethers.getContractFactory("CheeRainNFT");
  const cheerainNFT = await CheeRainNFT.deploy();

  await cheerainNFT.waitForDeployment();

  const contractAddress = await cheerainNFT.getAddress();
  console.log("✅ CheeRainNFTがデプロイされました!");
  console.log("📍 コントラクトアドレス:", contractAddress);

  // デプロイ情報を表示
  console.log("\n📋 デプロイ情報:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("コントラクト名: CheeRainNFT");
  console.log("シンボル: CHEERAIN");
  console.log("コントラクトアドレス:", contractAddress);
  console.log("デプロイアカウント:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // .env.localに追加する設定を表示
  console.log("\n📝 .env.localに以下を追加してください:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Polygonscanでの確認URL
  const network = await ethers.provider.getNetwork();
  if (network.chainId === 80002n) {
    console.log("\n🔍 Polygonscan（Amoy）で確認:");
    console.log(`https://amoy.polygonscan.com/address/${contractAddress}`);
  }

  console.log("\n✨ デプロイが完了しました!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ デプロイエラー:", error);
    process.exit(1);
  });
