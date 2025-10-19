export interface NFT {
  id: string;
  tokenId?: string;
  title: string;
  message: string;
  playerName: string;
  imageUrl?: string;
  creatorAddress?: string;
  createdAt: Date;
  transactionHash?: string;
}

export interface NFTFormData {
  title: string;
  message: string;
  playerName: string;
  image?: File | null;
}
