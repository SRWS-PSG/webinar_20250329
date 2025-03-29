import { useState } from 'react'
import { Search, BookOpen, TrendingUp, BarChart2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const trendData = [
  { year: '2020', value: 10 },
  { year: '2021', value: 15 },
  { year: '2022', value: 25 },
  { year: '2023', value: 30 },
  { year: '2024', value: 40 },
  { year: '2025', value: 45 },
];

const comparisonData = [
  { name: '食事療法', value: 65 },
  { name: '運動療法', value: 75 },
  { name: 'ストレス管理', value: 55 },
  { name: '睡眠改善', value: 60 },
];

const mockResults = {
  summary: "高血圧の非薬物療法として、食事療法（特に減塩とDASH食）、定期的な有酸素運動、ストレス管理技法、適切な睡眠習慣が効果的であることが示されています。これらの介入は、収縮期血圧を5-10 mmHg低下させる効果があり、軽度から中等度の高血圧患者では薬物療法の必要性を減らす可能性があります。",
  keyPoints: [
    "減塩（1日5g未満）により収縮期血圧が平均5mmHg低下",
    "週150分以上の中強度有酸素運動で収縮期血圧が平均7mmHg低下",
    "マインドフルネスやリラクゼーション技法で収縮期血圧が平均4mmHg低下",
    "7-8時間の質の良い睡眠で血圧管理が改善"
  ],
  evidenceLevels: {
    "食事療法": "A（強いエビデンス）",
    "運動療法": "A（強いエビデンス）",
    "ストレス管理": "B（中程度のエビデンス）",
    "睡眠改善": "B（中程度のエビデンス）"
  },
  references: [
    {
      title: "2020 International Society of Hypertension Global Hypertension Practice Guidelines",
      authors: "Unger T, Borghi C, Charchar F, et al.",
      journal: "Hypertension",
      year: "2020",
      doi: "10.1161/HYPERTENSIONAHA.120.15026",
      summary: "高血圧管理のための包括的なガイドラインで、非薬物療法の重要性を強調。減塩、DASH食、運動、体重管理などの介入が高血圧管理に効果的であることを示している。"
    },
    {
      title: "Effect of increased potassium intake on cardiovascular risk factors and disease: systematic review and meta-analyses",
      authors: "Aburto NJ, Hanson S, Gutierrez H, et al.",
      journal: "BMJ",
      year: "2023",
      doi: "10.1136/bmj.f1378",
      summary: "カリウム摂取量の増加が血圧低下に効果的であることを示したメタ分析。特に高血圧患者において、カリウム摂取の増加により収縮期血圧が平均4.4mmHg低下することが確認された。"
    }
  ]
};

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<null | typeof mockResults>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      const apiUrl = 'https://clinical-research-query-assistant-jqfubbqj.fly.dev/api/query';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      const formattedResults = {
        summary: data.summary,
        keyPoints: data.key_points,
        evidenceLevels: data.evidence_levels,
        references: data.references || []
      };
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-white mr-3" />
              <h1 className="text-2xl font-bold">PubMed</h1>
            </div>
            <div className="text-sm">
              <span className="mr-4">NCBI Resources</span>
              <span className="mr-4">How To</span>
              <span>Sign in to NCBI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <h2 className="text-lg font-medium text-gray-900">臨床研究クエリアシスタント</h2>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white border border-gray-300 rounded-md p-4 mb-6">
            <div className="mb-3">
              <h3 className="text-lg font-medium text-gray-900">研究質問を入力してください</h3>
              <p className="text-sm text-gray-600">
                自然言語で質問を入力すると、関連する医学文献の要約と主要ポイントが表示されます。
              </p>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="例: 高血圧の非薬物療法について教えて"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-gray-300"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !query.trim()}
                className="bg-blue-700 hover:bg-blue-800"
              >
                {isLoading ? '検索中...' : '検索'}
                {!isLoading && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              <p className="mt-2 text-gray-600">文献を検索中...</p>
            </div>
          )}

          {results && !isLoading && (
            <div className="mt-6">
              <div className="bg-blue-50 border-b border-blue-200 p-3 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">検索結果:</span> <span className="text-blue-700 font-medium">"{query}"</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">表示: 要約</span>
                    <span>並べ替え: 関連性</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/4">
                  <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">フィルター</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">表示タイプ</h4>
                        <ul className="space-y-2">
                          <li>
                            <button 
                              className={`w-full text-left px-2 py-1 rounded ${activeTab === 'summary' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveTab('summary')}
                            >
                              要約
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`w-full text-left px-2 py-1 rounded ${activeTab === 'keypoints' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveTab('keypoints')}
                            >
                              主要ポイント
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`w-full text-left px-2 py-1 rounded ${activeTab === 'references' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveTab('references')}
                            >
                              参考文献
                            </button>
                          </li>
                          <li>
                            <button 
                              className={`w-full text-left px-2 py-1 rounded ${activeTab === 'visualization' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveTab('visualization')}
                            >
                              視覚化
                            </button>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">エビデンスレベル</h4>
                        <ul className="space-y-1">
                          {results.evidenceLevels && Object.entries(results.evidenceLevels).map(([therapy, level], index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{therapy}</span>
                              <span className={`${
                                level.includes('A') ? 'text-green-700' : 
                                level.includes('B') ? 'text-blue-700' : 
                                'text-yellow-700'
                              }`}>
                                {level}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-3/4">
                  {activeTab === 'summary' && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">研究結果の要約</h3>
                      <p className="text-gray-700 leading-relaxed">{results.summary}</p>
                    </div>
                  )}
                  
                  {activeTab === 'keypoints' && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">主要ポイント</h3>
                      <ul className="space-y-3">
                        {results.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'references' && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">参考文献</h3>
                      <div className="space-y-4">
                        {results.references && results.references.map((reference, index) => (
                          <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                            <h4 className="font-medium text-blue-700 hover:underline cursor-pointer mb-1">{reference.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{reference.authors} · {reference.journal} · {reference.year}</p>
                            <p className="text-sm text-gray-700">{reference.summary}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span className="mr-3">DOI: {reference.doi}</span>
                              <span className="flex items-center text-blue-600 cursor-pointer">
                                <Search className="h-3 w-3 mr-1" /> 全文を表示
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'visualization' && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">データの視覚化</h3>
                      <div className="space-y-8">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                            研究トレンド (2020-2025)
                          </h4>
                          <div className="h-72 border border-gray-200 p-2 rounded">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} name="研究論文数" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                            治療法の効果比較
                          </h4>
                          <div className="h-72 border border-gray-200 p-2 rounded">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#3b82f6" name="効果スコア (0-100)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white border border-gray-300 rounded-md p-4 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">デモシナリオ</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal border-gray-300 hover:bg-blue-50"
                onClick={() => {
                  setQuery('高血圧の非薬物療法について教えて');
                  handleSearch();
                }}
              >
                シナリオ1: 「高血圧の非薬物療法について教えて」
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal border-gray-300 hover:bg-blue-50"
                onClick={() => {
                  setQuery('妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？');
                  handleSearch();
                }}
              >
                シナリオ2: 「妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？」
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal border-gray-300 hover:bg-blue-50"
                onClick={() => {
                  setQuery('COVID-19ワクチンの長期的効果に関する最新の知見は？');
                  handleSearch();
                }}
              >
                シナリオ3: 「COVID-19ワクチンの長期的効果に関する最新の知見は？」
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
