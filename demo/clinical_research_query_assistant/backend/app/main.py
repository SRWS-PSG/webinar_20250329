from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import json

app = FastAPI(title="臨床研究クエリアシスタント API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class EvidenceLevel(BaseModel):
    therapy: str
    level: str

class QueryResponse(BaseModel):
    summary: str
    key_points: List[str]
    evidence_levels: Dict[str, str]

mock_data = {
    "高血圧の非薬物療法について教えて": {
        "summary": "高血圧の非薬物療法として、食事療法（特に減塩とDASH食）、定期的な有酸素運動、ストレス管理技法、適切な睡眠習慣が効果的であることが示されています。これらの介入は、収縮期血圧を5-10 mmHg低下させる効果があり、軽度から中等度の高血圧患者では薬物療法の必要性を減らす可能性があります。",
        "key_points": [
            "減塩（1日5g未満）により収縮期血圧が平均5mmHg低下",
            "週150分以上の中強度有酸素運動で収縮期血圧が平均7mmHg低下",
            "マインドフルネスやリラクゼーション技法で収縮期血圧が平均4mmHg低下",
            "7-8時間の質の良い睡眠で血圧管理が改善"
        ],
        "evidence_levels": {
            "食事療法": "A（強いエビデンス）",
            "運動療法": "A（強いエビデンス）",
            "ストレス管理": "B（中程度のエビデンス）",
            "睡眠改善": "B（中程度のエビデンス）"
        }
    },
    "妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？": {
        "summary": "妊娠中の鉄欠乏性貧血予防には、鉄剤サプリメント（特に第2・第3期）、鉄分豊富な食事、葉酸摂取、ビタミンCとの併用が効果的です。鉄剤サプリメントは最も強いエビデンスがあり、特に貧血リスクの高い女性に推奨されます。",
        "key_points": [
            "妊娠第2期と第3期に30-60mg/日の鉄剤サプリメントが最も効果的",
            "鉄分豊富な食品（赤身肉、豆類、緑葉野菜）の定期的な摂取",
            "葉酸400-800μg/日の摂取で造血機能をサポート",
            "ビタミンCと鉄分を同時に摂取することで鉄の吸収率が向上"
        ],
        "evidence_levels": {
            "鉄剤サプリメント": "A（強いエビデンス）",
            "食事指導": "B（中程度のエビデンス）",
            "葉酸摂取": "B（中程度のエビデンス）",
            "ビタミンC併用": "B（中程度のエビデンス）"
        }
    },
    "COVID-19ワクチンの長期的効果に関する最新の知見は？": {
        "summary": "COVID-19ワクチンの長期的効果に関する研究では、初回接種後1-2年の間に抗体価は徐々に低下するものの、T細胞免疫は比較的長期間持続することが示されています。追加接種（ブースター）により免疫応答が再活性化され、変異株に対する交差防御も強化されます。長期的な安全性プロファイルは良好で、重篤な副反応は非常にまれです。",
        "key_points": [
            "抗体価は初回接種後6-12ヶ月で徐々に低下するが、T細胞免疫は1-2年以上持続",
            "追加接種により免疫応答が再活性化され、変異株に対する防御も強化",
            "長期追跡調査では、ワクチン接種者は非接種者と比較して重症化リスクが60-80%低下",
            "最新の変異株に対応した更新ワクチンにより、より広範な防御が可能に"
        ],
        "evidence_levels": {
            "抗体持続性": "B（中程度のエビデンス）",
            "T細胞免疫": "B（中程度のエビデンス）",
            "追加接種効果": "A（強いエビデンス）",
            "安全性プロファイル": "A（強いエビデンス）"
        }
    }
}

default_response = {
    "summary": "お問い合わせの内容に関する具体的な情報は現在のデータベースにありません。より具体的な質問や、別のトピックについてお試しください。",
    "key_points": [
        "データベースに該当する情報がありません",
        "質問の表現を変えてみてください",
        "「高血圧の非薬物療法について教えて」などの質問が利用可能です",
        "「妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？」などの質問も利用可能です"
    ],
    "evidence_levels": {
        "情報なし": "データなし"
    }
}

@app.get("/")
def read_root():
    return {"message": "臨床研究クエリアシスタント API"}

@app.post("/api/query", response_model=QueryResponse)
def process_query(request: QueryRequest):
    query = request.query
    
    if query in mock_data:
        return mock_data[query]
    
    for key, value in mock_data.items():
        if any(keyword in query for keyword in key.split()):
            return value
    
    return default_response

@app.get("/api/samples")
def get_samples():
    return {
        "queries": list(mock_data.keys())
    }
