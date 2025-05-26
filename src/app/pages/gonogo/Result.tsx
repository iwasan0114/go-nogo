"use client";
import React, { useMemo } from 'react';
import Button from '@/app/components/Button';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

// 試行データの型定義
interface TrialData {
  trialNumber: number;
  type: 'go' | 'nogo';
  response: boolean;
  correct: boolean;
  reactionTime: number | null;
  timestamp: number;
}

interface ResultProps {
  results: TrialData[];
  onReturnToProfile: () => void;
}

export default function Result({ results, onReturnToProfile }: ResultProps) {
  // テーブルカラムの定義
  const columnHelper = createColumnHelper<TrialData>();
  
  const columns = useMemo(
    () => [
      columnHelper.accessor('trialNumber', {
        header: '試行番号',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('type', {
        header: '刺激タイプ',
        cell: info => (
          <span className={`px-2 py-1 rounded text-white text-sm ${
            info.getValue() === 'go' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            {info.getValue().toUpperCase()}
          </span>
        ),
      }),
      columnHelper.accessor('response', {
        header: '反応',
        cell: info => (
          <span className={`px-2 py-1 rounded text-white text-sm ${
            info.getValue() ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {info.getValue() ? 'あり' : 'なし'}
          </span>
        ),
      }),
      columnHelper.accessor('correct', {
        header: '正誤',
        cell: info => (
          <span className={`px-2 py-1 rounded text-white text-sm ${
            info.getValue() ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {info.getValue() ? '正解' : '不正解'}
          </span>
        ),
      }),
      columnHelper.accessor('reactionTime', {
        header: '反応時間 (ms)',
        cell: info => {
          const value = info.getValue();
          return value !== null ? `${value}ms` : '-';
        },
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 結果の集計
  const summary = useMemo(() => {
    if (results.length === 0) return null;
    
    const correctCount = results.filter(r => r.correct).length;
    const goTrials = results.filter(r => r.type === 'go');
    const goCorrect = goTrials.filter(r => r.correct).length;
    const nogoTrials = results.filter(r => r.type === 'nogo');
    const nogoCorrect = nogoTrials.filter(r => r.correct).length;
    
    const averageRT = goTrials.filter(r => r.response && r.reactionTime)
      .reduce((sum, r) => sum + r.reactionTime!, 0) /
      goTrials.filter(r => r.response && r.reactionTime).length || 0;

    return {
      totalTrials: results.length,
      correctCount,
      accuracy: (correctCount / results.length * 100).toFixed(1),
      goAccuracy: goTrials.length > 0 ? (goCorrect / goTrials.length * 100).toFixed(1) : 0,
      nogoAccuracy: nogoTrials.length > 0 ? (nogoCorrect / nogoTrials.length * 100).toFixed(1) : 0,
      averageRT: averageRT.toFixed(0),
    };
  }, [results]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">課題結果</h1>
      
      {/* 結果サマリー */}
      {summary && (
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg md:text-xl font-bold text-green-800 mb-3 md:mb-4">結果サマリー</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl md:text-2xl font-bold text-gray-800">{summary.totalTrials}</div>
              <div className="text-xs md:text-sm text-gray-600">総試行数</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl md:text-2xl font-bold text-green-600">{summary.accuracy}%</div>
              <div className="text-xs md:text-sm text-gray-600">全体正答率</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{summary.averageRT}ms</div>
              <div className="text-xs md:text-sm text-gray-600">平均反応時間</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl md:text-2xl font-bold text-blue-500">{summary.goAccuracy}%</div>
              <div className="text-xs md:text-sm text-gray-600">Go試行正答率</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl md:text-2xl font-bold text-red-500">{summary.nogoAccuracy}%</div>
              <div className="text-xs md:text-sm text-gray-600">NoGo試行正答率</div>
            </div>
          </div>
        </div>
      )}

      {/* 詳細結果 */}
      {results.length > 0 ? (
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">詳細結果</h2>
          
          {/* スマホ表示: カード形式 */}
          <div className="block md:hidden space-y-3">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">試行 {result.trialNumber}</span>
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    result.type === 'go' ? 'bg-blue-500' : 'bg-red-500'
                  }`}>
                    {result.type.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">反応: </span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      result.response ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {result.response ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">正誤: </span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      result.correct ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {result.correct ? '正解' : '不正解'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">反応時間: </span>
                    <span className="font-semibold">
                      {result.reactionTime !== null ? `${result.reactionTime}ms` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* デスクトップ表示: テーブル形式 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">結果データがありません。</p>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={onReturnToProfile}
          value="プロフィールに戻る"
        />
      </div>
    </div>
  );
}