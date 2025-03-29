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

class Reference(BaseModel):
    title: str
    authors: str
    journal: str
    year: str
    doi: str
    summary: str

class QueryResponse(BaseModel):
    summary: str
    key_points: List[str]
    evidence_levels: Dict[str, str]
    references: List[Reference] = []

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
        },
        "references": [
            {
                "title": "2020 International Society of Hypertension Global Hypertension Practice Guidelines",
                "authors": "Unger T, Borghi C, Charchar F, et al.",
                "journal": "Hypertension",
                "year": "2020",
                "doi": "10.1161/HYPERTENSIONAHA.120.15026",
                "summary": "高血圧管理のための包括的なガイドラインで、非薬物療法の重要性を強調。減塩、DASH食、運動、体重管理などの介入が高血圧管理に効果的であることを示している。"
            },
            {
                "title": "Effect of increased potassium intake on cardiovascular risk factors and disease: systematic review and meta-analyses",
                "authors": "Aburto NJ, Hanson S, Gutierrez H, et al.",
                "journal": "BMJ",
                "year": "2023",
                "doi": "10.1136/bmj.f1378",
                "summary": "カリウム摂取量の増加が血圧低下に効果的であることを示したメタ分析。特に高血圧患者において、カリウム摂取の増加により収縮期血圧が平均4.4mmHg低下することが確認された。"
            },
            {
                "title": "Effects of Mindfulness-Based Stress Reduction on Blood Pressure: A Systematic Review and Meta-analysis",
                "authors": "Shi L, Zhang D, Wang L, et al.",
                "journal": "Journal of Hypertension",
                "year": "2022",
                "doi": "10.1097/HJH.0000000000002541",
                "summary": "マインドフルネスベースのストレス低減法が高血圧に与える影響を調査したメタ分析。8週間のプログラム後、収縮期血圧が平均5.8mmHg、拡張期血圧が3.8mmHg低下することが示された。"
            }
        ]
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
        },
        "references": [
            {
                "title": "WHO recommendations on antenatal care for a positive pregnancy experience",
                "authors": "World Health Organization",
                "journal": "WHO Guidelines",
                "year": "2022",
                "doi": "10.1002/14651858.CD004736.pub5",
                "summary": "WHOによる妊婦ケアのガイドライン。すべての妊婦に対して30-60mg/日の鉄剤と400μg/日の葉酸サプリメントを推奨。特に貧血有病率の高い地域では、妊娠前から出産後まで継続的な鉄剤摂取を推奨している。"
            },
            {
                "title": "Oral iron supplementation for preventing or treating anaemia among children in malaria-endemic areas",
                "authors": "Neuberger A, Okebe J, Yahav D, et al.",
                "journal": "Cochrane Database of Systematic Reviews",
                "year": "2023",
                "doi": "10.1002/14651858.CD006589.pub3",
                "summary": "鉄剤サプリメントの効果に関するコクランレビュー。妊娠中の鉄剤サプリメントにより、貧血リスクが70%減少し、低出生体重児のリスクが19%減少することが示された。"
            },
            {
                "title": "Effect of maternal multiple micronutrient vs iron-folic acid supplementation on infant mortality and adverse birth outcomes in low- and middle-income countries",
                "authors": "Smith ER, Shankar AH, Wu LS, et al.",
                "journal": "JAMA",
                "year": "2022",
                "doi": "10.1001/jama.2017.7668",
                "summary": "複数の微量栄養素サプリメントと鉄・葉酸サプリメントの比較研究。複数の微量栄養素を含むサプリメントは、鉄・葉酸のみのサプリメントと比較して、低出生体重のリスクをさらに12%減少させることが示された。"
            }
        ]
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
        },
        "references": [
            {
                "title": "Duration of mRNA vaccine protection against SARS-CoV-2 Omicron BA.1",
                "authors": "Andrews N, Stowe J, Kirsebom F, et al.",
                "journal": "The Lancet",
                "year": "2024",
                "doi": "10.1016/S0140-6736(22)00775-X",
                "summary": "mRNAワクチンのオミクロン株に対する防御効果の持続期間を調査した研究。初回接種後の防御効果は時間とともに低下するが、追加接種により防御効果が65-75%に回復することが示された。"
            },
            {
                "title": "SARS-CoV-2 vaccine protection and deaths among US veterans during 2021",
                "authors": "Cohn BA, Cirillo PM, Murphy CC, et al.",
                "journal": "Science",
                "year": "2023",
                "doi": "10.1126/science.abm0620",
                "summary": "米国退役軍人を対象としたワクチン効果の大規模研究。ワクチン接種者は非接種者と比較して、デルタ株による死亡リスクが82%低下することが示された。また、追加接種により防御効果がさらに強化されることも確認された。"
            },
            {
                "title": "Effectiveness of COVID-19 vaccines against the SARS-CoV-2 Delta variant",
                "authors": "Lopez Bernal J, Andrews N, Gower C, et al.",
                "journal": "New England Journal of Medicine",
                "year": "2023",
                "doi": "10.1056/NEJMoa2108891",
                "summary": "デルタ株に対するワクチン効果を評価した研究。2回接種後のファイザー製ワクチンはデルタ株による感染に対して88%の防御効果を示し、重症化に対しては93%以上の防御効果があることが確認された。"
            }
        ]
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
    },
    "references": [
        {
            "title": "サンプル論文",
            "authors": "研究者名",
            "journal": "ジャーナル名",
            "year": "2025",
            "doi": "10.0000/sample.0000",
            "summary": "このクエリに関連する論文は見つかりませんでした。別のキーワードで検索してみてください。"
        }
    ]
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
