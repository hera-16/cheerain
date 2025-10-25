// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * APIレスポンスの型定義
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

/**
 * HTTPリクエストを実行するヘルパー関数
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // JWTトークンをlocalStorageから取得
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // トークンがあればAuthorizationヘッダーに追加
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log('📤 [API Request]', {
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers,
      body: options.body
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('� [API Response] Status:', response.status, response.statusText);
    console.log('� [API Response] Headers:', Object.fromEntries(response.headers.entries()));

    // レスポンスのテキストを取得
    const responseText = await response.text();
    console.log('📥 [API Response] Raw text:', responseText);

    // JSONパースを試みる
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
      console.log('� [API Response] Parsed data:', data);
    } catch (parseError) {
      console.error('❌ [API Error] JSONパースエラー:', parseError);
      console.error('❌ [API Error] レスポンステキスト:', responseText);
      throw new Error('サーバーからの応答が不正です: ' + responseText.substring(0, 100));
    }

    if (!response.ok) {
      console.error('❌ [API Error] Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.error?.message || data.message || 'リクエストに失敗しました');
    }

    return data;
  } catch (error) {
    console.error('❌ [API Error] Exception:', error);
    throw error;
  }
}

/**
 * APIクライアント
 */
export const api = {
  // GET
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),

  // POST
  post: <T>(endpoint: string, body: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PUT
  put: <T>(endpoint: string, body: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // PATCH
  patch: <T>(endpoint: string, body: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // DELETE
  delete: <T>(endpoint: string) =>
    fetchApi<T>(endpoint, { method: 'DELETE' }),

  // ファイルアップロード（multipart/form-data）
  uploadFile: async <T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers: HeadersInit = {};

    // トークンがあればAuthorizationヘッダーに追加
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('📤 [Upload] Starting upload to:', `${API_BASE_URL}${endpoint}`);
      console.log('📤 [Upload] Form data entries:', Array.from(formData.entries()));

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('📥 [Upload] Response status:', response.status, response.statusText);

      // レスポンステキストを取得
      const responseText = await response.text();
      console.log('📥 [Upload] Response text:', responseText);

      // JSONパースを試みる
      let data: ApiResponse<T>;
      try {
        data = JSON.parse(responseText);
        console.log('📥 [Upload] Parsed data:', data);
      } catch (parseError) {
        console.error('❌ [Upload] JSONパースエラー:', parseError);
        console.error('❌ [Upload] レスポンステキスト:', responseText);
        throw new Error('サーバーからの応答が不正です: ' + responseText.substring(0, 100));
      }

      if (!response.ok) {
        console.error('❌ [Upload] Response not OK:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.error?.message || data.message || 'ファイルのアップロードに失敗しました');
      }

      return data;
    } catch (error) {
      console.error('❌ [Upload] Exception:', error);
      throw error;
    }
  },
};

export default api;
