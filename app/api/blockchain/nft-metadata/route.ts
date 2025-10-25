import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { CHEERAIN_NFT_ABI } from '@/lib/contract';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    // Viemクライアントを作成
    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http('https://rpc-amoy.polygon.technology'),
    });

    // コントラクトからメタデータを取得
    const metadata = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: CHEERAIN_NFT_ABI,
      functionName: 'getNFTMetadata',
      args: [BigInt(tokenId)],
    });

    // BigIntを文字列に変換してシリアライズ可能にする
    const serializedMetadata = {
      title: metadata.title,
      message: metadata.message,
      playerName: metadata.playerName,
      imageUrl: metadata.imageUrl,
      creator: metadata.creator,
      paymentAmount: metadata.paymentAmount.toString(),
      createdAt: metadata.createdAt.toString(),
      isVenueAttendee: metadata.isVenueAttendee,
    };

    return NextResponse.json({
      success: true,
      data: serializedMetadata,
    });
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch NFT metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
