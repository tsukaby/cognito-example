// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // クライアントサイドから送信されたアクセストークンを取得
  const authorization = req.headers.authorization || '';

  const apiUrl = 'http://localhost:3000/api/v1/items';

  try {
    // リソースサーバーへのリクエストにアクセストークンを追加
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': authorization,
      },
    });

    // リソースサーバーからのレスポンスをそのまま返す
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    // エラーメッセージと共に適切なエラーステータスコードを設定してレスポンスを返す
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
}
