# 臨床研究クエリアシスタント
## デモアプリ開発プロセス

---

## 目次

1. プロジェクト概要
2. 要件定義
3. アーキテクチャ設計
4. バックエンド実装
5. フロントエンド実装
6. デプロイメント
7. ユーザーとDevinのインタラクション
8. デモンストレーション

---

## 1. プロジェクト概要

### 目的
- 臨床研究者向けの自然言語クエリアシスタント
- エージェント型AIによる研究効率化のデモンストレーション
- ウェブセミナー「やりたいことを伝えるだけ」のための実例提示

### ターゲットユーザー
- 臨床研究者
- 医療従事者
- 研究機関管理者

---

## 2. 要件定義

### 機能要件
- 自然言語による研究質問の入力
- 関連医学文献の検索と要約
- 研究結果の視覚化
- 根拠となる論文の表示と要約

### 非機能要件
- シンプルで直感的なUI
- 30分以内のデモ可能な規模
- 複数のデモシナリオ対応

---

## 3. アーキテクチャ設計

### 技術スタック
- **フロントエンド**: React + TypeScript
- **バックエンド**: FastAPI (Python)
- **デプロイ**: Fly.io (バックエンド), Devin Apps (フロントエンド)

### システム構成
```
┌─────────────┐      ┌─────────────┐
│  React UI   │ ──→ │  FastAPI    │
│  (フロントエンド) │ ←── │  (バックエンド) │
└─────────────┘      └─────────────┘
```

---

## 4. バックエンド実装

### FastAPI アプリケーション構築
- Pydanticモデル定義
- APIエンドポイント実装
- モックデータ作成

### コードサンプル
```python
@app.post("/api/query", response_model=QueryResponse)
async def process_query(query_request: QueryRequest):
    query_text = query_request.query.lower()
    
    # モックデータから適切な応答を検索
    for mock_query in mock_data:
        if query_text in mock_query["query_text"]:
            return mock_query["response"]
    
    # デフォルトの応答
    return default_response
```

---

## 5. フロントエンド実装

### React コンポーネント
- 検索フォーム
- 結果表示タブ（要約、主要ポイント、参考文献、視覚化）
- ローディング状態管理

### コードサンプル
```tsx
const handleSearch = async () => {
  setIsLoading(true);
  
  try {
    const apiUrl = 'https://clinical-research-query-assistant-jqfubbqj.fly.dev/api/query';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    const data = await response.json();
    setResults(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. デプロイメント

### バックエンドデプロイ (Fly.io)
```bash
cd backend
fly launch --name clinical-research-query-assistant
fly deploy
```

### フロントエンドデプロイ (Devin Apps)
```bash
cd frontend
npm run build
deploy_frontend dir="./dist"
```

### 公開URL
- フロントエンド: https://ai-research-website-p1vds98b.devinapps.com
- バックエンドAPI: https://clinical-research-query-assistant-jqfubbqj.fly.dev/

---

## 7. デモンストレーション

### デモシナリオ
1. 高血圧の非薬物療法について
2. 妊娠中の鉄欠乏性貧血の予防
3. COVID-19ワクチンの長期的効果

### 機能ハイライト
- 自然言語クエリ処理
- 医学文献の要約表示
- 根拠となる論文の表示
- 研究結果の視覚化

---

## 7. ユーザーとDevinのインタラクション

### 初期要件定義
- ユーザー：「臨床研究クエリアシスタントのデモアプリを作成して」
- Devin：要件の明確化と提案、ターゲットユーザーの分析
- ユーザー：「30分以内のデモで公開できるものにして」
- Devin：規模の調整と実現可能な機能の提案

### 実装プロセス
- ユーザー：「実装を開始して」
- Devin：アーキテクチャ設計、コード生成、テスト
- ユーザー：「デモ用のwebサーバーを立ち上げられる？」
- Devin：ローカル開発環境とデプロイメントの説明

### 機能拡張
- ユーザー：「根拠となる論文も表示されるようにして」
- Devin：バックエンドとフロントエンドの拡張実装
- ユーザー：「論文のポイントの要約も表示するように」
- Devin：参考文献タブと論文要約機能の追加

### コミュニケーションの特徴
- 自然言語による指示のみでの開発
- 技術的詳細を抽象化した対話
- 反復的な改善サイクルの短縮
- 日本語でのコミュニケーション

---

## 8. 開発プロセスのポイント

### エージェントAIを活用した開発
1. 要件の自然言語での記述
2. アーキテクチャと技術選定の自動化
3. コード生成とテスト
4. デプロイメントの自動化

### 従来の開発との比較
- 開発時間の大幅短縮（数時間で完成）
- 専門知識の補完（医学+プログラミング）
- 反復的な改善の効率化

---

## まとめ

### 成果
- 臨床研究者向けの実用的なデモアプリケーション
- エージェントAIによる効率的な開発プロセスの実証
- 複雑なドメイン知識を組み込んだアプリケーション

### 今後の展望
- 実際の医学文献データベースとの連携
- 自然言語処理能力の強化
- ユーザーフィードバックに基づく機能拡張

---

## ご清聴ありがとうございました

### リソース
- デモアプリ: https://ai-research-website-p1vds98b.devinapps.com
- ソースコード: https://github.com/SRWS-PSG/webinar_20250329
