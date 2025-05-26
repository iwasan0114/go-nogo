import React from "react"

export default function Description() {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        GoNogo課題について
                    </h1>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">課題の概要</h2>
                    <p className="text-gray-700 mb-4">
                        GoNogo課題は、認知機能や注意力、抑制制御能力を測定する心理学的テストです。
                        参加者は画面に表示される刺激に対して、特定の条件下でのみ反応（Go）し、
                        特定の条件では反応を抑制（NoGo）する必要があります。
                    </p>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">測定される能力</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">反応速度</h3>
                            <p className="text-sm">Go試行での反応時間から、情報処理速度を評価します</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-medium text-green-800 mb-2">抑制制御</h3>
                            <p className="text-sm">NoGo試行での反応抑制率から、衝動制御能力を評価します</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">注意事項</h2>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>集中できる静かな環境で実施してください</li>
                            <li>画面を正面から見て、適切な距離を保ってください</li>
                            <li>疲れている時は避け、体調の良い時に実施してください</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
}