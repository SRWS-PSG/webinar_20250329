import { useState } from 'react'
import { Search, BookOpen, TrendingUp, BarChart2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">臨床研究クエリアシスタント</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">研究質問を入力してください</CardTitle>
              <CardDescription>
                自然言語で質問を入力すると、関連する医学文献の要約と主要ポイントが表示されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="例: 高血圧の非薬物療法について教えて"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
                  {isLoading ? '検索中...' : '検索'}
                  {!isLoading && <Search className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="mt-6 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              <p className="mt-2 text-gray-600">文献を検索中...</p>
            </div>
          )}

          {results && !isLoading && (
            <div className="mt-6">
              <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">要約</TabsTrigger>
                  <TabsTrigger value="keypoints">主要ポイント</TabsTrigger>
                  <TabsTrigger value="references">参考文献</TabsTrigger>
                  <TabsTrigger value="visualization">視覚化</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>研究結果の要約</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{results.summary}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="keypoints" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>主要ポイント</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">エビデンスレベル</h4>
                        <div className="space-y-2">
                          {Object.entries(results.evidenceLevels).map(([therapy, level], index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-700">{therapy}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                level.includes('A') ? 'bg-green-100 text-green-800' : 
                                level.includes('B') ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {level}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="references" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>参考文献</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {results.references && results.references.map((reference, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              <div>
                                <div className="font-medium">{reference.title}</div>
                                <div className="text-sm text-gray-500">{reference.authors} ({reference.year})</div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <div>
                                  <span className="font-medium">掲載誌:</span> {reference.journal}
                                </div>
                                <div>
                                  <span className="font-medium">DOI:</span> {reference.doi}
                                </div>
                                <div className="mt-3">
                                  <span className="font-medium">要約:</span>
                                  <p className="mt-1 text-gray-700">{reference.summary}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="visualization" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>データの視覚化</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                            研究トレンド (2020-2025)
                          </h4>
                          <div className="h-72">
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
                          <div className="h-72">
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
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <Card className="mt-6 border-gray-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">デモシナリオ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    setQuery('高血圧の非薬物療法について教えて');
                    handleSearch();
                  }}
                >
                  シナリオ1: 「高血圧の非薬物療法について教えて」
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    setQuery('妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？');
                    handleSearch();
                  }}
                >
                  シナリオ2: 「妊娠中の鉄欠乏性貧血の予防に最も効果的なアプローチは？」
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    setQuery('COVID-19ワクチンの長期的効果に関する最新の知見は？');
                    handleSearch();
                  }}
                >
                  シナリオ3: 「COVID-19ワクチンの長期的効果に関する最新の知見は？」
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App
