// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CheeRainNFT
 * @dev ERC721トークンでファンの応援メッセージをNFT化
 * ギラヴァンツ北九州の選手への応援カードとして機能
 */
contract CheeRainNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // トークンIDカウンター
    uint256 private _tokenIdCounter;

    // NFTメタデータ構造体
    struct NFTMetadata {
        string title;           // タイトル
        string message;         // 応援メッセージ
        string playerName;      // 選手名
        string imageUrl;        // 画像URL
        address creator;        // 作成者アドレス
        uint256 paymentAmount;  // 支払金額（wei単位）
        uint256 createdAt;      // 作成タイムスタンプ
        bool isVenueAttendee;   // 現地参加フラグ
    }

    // トークンID => メタデータのマッピング
    mapping(uint256 => NFTMetadata) public nftMetadata;

    // ユーザーアドレス => 発行したNFTのトークンIDリスト
    mapping(address => uint256[]) public userNFTs;

    // 選手名 => NFTのトークンIDリスト
    mapping(string => uint256[]) public playerNFTs;

    // イベント定義
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string playerName,
        string title,
        uint256 paymentAmount,
        bool isVenueAttendee
    );

    constructor() ERC721("CheeRain Support Card", "CHEERAIN") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    /**
     * @dev NFTを発行する
     * @param to 受取アドレス
     * @param title タイトル
     * @param message 応援メッセージ
     * @param playerName 選手名
     * @param imageUrl 画像URL
     * @param paymentAmount 支払金額
     * @param isVenueAttendee 現地参加フラグ
     * @return tokenId 発行されたトークンID
     */
    function mintNFT(
        address to,
        string memory title,
        string memory message,
        string memory playerName,
        string memory imageUrl,
        uint256 paymentAmount,
        bool isVenueAttendee
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(message).length > 0, "Message cannot be empty");
        require(bytes(playerName).length > 0, "Player name cannot be empty");
        require(to != address(0), "Invalid recipient address");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        // NFTをミント
        _safeMint(to, tokenId);

        // メタデータを保存
        nftMetadata[tokenId] = NFTMetadata({
            title: title,
            message: message,
            playerName: playerName,
            imageUrl: imageUrl,
            creator: msg.sender,
            paymentAmount: paymentAmount,
            createdAt: block.timestamp,
            isVenueAttendee: isVenueAttendee
        });

        // ユーザーとプレイヤーのマッピングを更新
        userNFTs[to].push(tokenId);
        playerNFTs[playerName].push(tokenId);

        // イベント発火
        emit NFTMinted(
            tokenId,
            msg.sender,
            playerName,
            title,
            paymentAmount,
            isVenueAttendee
        );

        return tokenId;
    }

    /**
     * @dev ユーザーが所有するNFTのトークンIDリストを取得
     * @param user ユーザーアドレス
     * @return トークンIDの配列
     */
    function getNFTsByUser(address user) public view returns (uint256[] memory) {
        return userNFTs[user];
    }

    /**
     * @dev 選手別のNFTトークンIDリストを取得
     * @param playerName 選手名
     * @return トークンIDの配列
     */
    function getNFTsByPlayer(string memory playerName) public view returns (uint256[] memory) {
        return playerNFTs[playerName];
    }

    /**
     * @dev NFTメタデータを取得
     * @param tokenId トークンID
     * @return NFTMetadata構造体
     */
    function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        return nftMetadata[tokenId];
    }

    /**
     * @dev 総発行数を取得
     * @return 総NFT発行数
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev トークンURIを取得（オプション）
     * @param tokenId トークンID
     * @return トークンURI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");

        // オンチェーンメタデータを返す（簡易版）
        NFTMetadata memory metadata = nftMetadata[tokenId];

        // 簡易的にメタデータを文字列として返す
        // 実際にはJSONエンコーディングが必要だが、Solidityでは複雑なので省略
        return string(abi.encodePacked(
            "CheeRain NFT #",
            tokenId.toString(),
            " - ",
            metadata.title
        ));
    }

    /**
     * @dev ERC721URIStorageのsuperclassメソッドをオーバーライド
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
