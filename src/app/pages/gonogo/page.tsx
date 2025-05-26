"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

// 試行データの型定義
interface TrialData {
  trialNumber: number;
  type: 'go' | 'nogo';
  response: boolean; // ボタンを押したかどうか
  correct: boolean;  // 正解かどうか
  reactionTime: number | null; // 反応時間（ms）
  timestamp: number;
}

// 課題の設定
const TRIAL_COUNT = 2; // 総試行数
const GO_RATIO = 0.7;   // Go試行の割合
const STIMULUS_DURATION = 1500; // 刺激表示時間（ms）
const ITI_DURATION = 1000; // 試行間間隔（ms）

export default function GoNogo() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [stimulusType, setStimulusType] = useState<'go' | 'nogo' | null>(null);
  const [showStimulus, setShowStimulus] = useState(false);
  const [results, setResults] = useState<TrialData[]>([]);
  const [hasResponded, setHasResponded] = useState(false);

  // 反応時間計測用
  const stimulusStartTime = useRef<number>(0);
  const trialsRef = useRef<('go' | 'nogo')[]>([]);

  // 試行順序を生成（ランダム）
  const generateTrials = useCallback(() => {
    const goCount = Math.floor(TRIAL_COUNT * GO_RATIO);
    const nogoCount = TRIAL_COUNT - goCount;
    const trials: ('go' | 'nogo')[] = [
      ...Array(goCount).fill('go'),
      ...Array(nogoCount).fill('nogo')
    ];
    // シャッフル
    for (let i = trials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trials[i], trials[j]] = [trials[j], trials[i]];
    }
    return trials;
  }, []);

  // クリックイベントハンドラー
  const handleStimulusClick = useCallback(() => {
    if (!isRunning || !showStimulus || hasResponded) return;

    const reactionTime = Date.now() - stimulusStartTime.current;
    const isCorrect = stimulusType === 'go';

    setHasResponded(true);

    // 結果を記録
    const trialData: TrialData = {
      trialNumber: currentTrial + 1,
      type: stimulusType!,
      response: true,
      correct: isCorrect,
      reactionTime: reactionTime,
      timestamp: Date.now()
    };

    setResults(prev => [...prev, trialData]);
    console.log('Trial Result:', trialData);
  }, [isRunning, showStimulus, hasResponded, stimulusType, currentTrial]);

  // 課題開始
  const startTask = () => {
    setIsRunning(true);
    setCurrentTrial(0);
    setResults([]);
    trialsRef.current = generateTrials();
    runNextTrial();
  };

  // 次の試行を実行
  const runNextTrial = useCallback(() => {
    const trialType = trialsRef.current[currentTrial];

    // 試行間間隔
    setTimeout(() => {
      setStimulusType(trialType);
      setShowStimulus(true);
      setHasResponded(false);
      stimulusStartTime.current = Date.now();

      // 刺激表示時間後の処理
      setTimeout(() => {
        if (!hasResponded) {
          // 無反応の場合の記録
          const isCorrect = trialType === 'nogo';
          const trialData: TrialData = {
            trialNumber: currentTrial + 1,
            type: trialType,
            response: false,
            correct: isCorrect,
            reactionTime: null,
            timestamp: Date.now()
          };

          setResults(prev => [...prev, trialData]);
          console.log('Trial Result (No Response):', trialData);
        }

        setShowStimulus(false);
        // 次の試行に進む前に、現在の試行数をチェック
        setCurrentTrial(prev => {
          const nextTrial = prev + 1;
          if (nextTrial >= TRIAL_COUNT) {
            // 課題終了
            setIsRunning(false);
            console.log('Task completed!');
            router.push("/pages/result"); // 結果ページへ遷移
          }
          return nextTrial;
        });
      }, STIMULUS_DURATION);
    }, ITI_DURATION);
  }, [currentTrial, hasResponded]);

  // 試行番号が変わったら次の試行を実行
  useEffect(() => {
    console.log("isRunning:", isRunning, "currentTrial:", currentTrial);
    if (isRunning && currentTrial > 0 && currentTrial < TRIAL_COUNT) {
      runNextTrial();
    }
  }, [currentTrial, isRunning, runNextTrial]);

  const handleStop = () => {
    if (window.confirm("課題を中止しますか？")) {
      setIsRunning(false);
      setShowStimulus(false);
      router.push("/pages/profile");
    }
  };

  // 結果の集計
  const correctCount = results.filter(r => r.correct).length;
  const goTrials = results.filter(r => r.type === 'go');
  const averageRT = goTrials.filter(r => r.response && r.reactionTime)
    .reduce((sum, r) => sum + r.reactionTime!, 0) /
    goTrials.filter(r => r.response && r.reactionTime).length || 0;

  return (
    <div className="min-h-screen bg-gray-100 relative">

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">GoNogo課題</h1>

          {/* 進捗表示 */}
          {isRunning && (
            <div className="text-center mb-4">
              <p className="text-lg text-gray-600">
                試行 {currentTrial + 1} / {TRIAL_COUNT}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentTrial) / TRIAL_COUNT) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 課題実行エリア */}
          <div
            className="bg-white rounded-lg shadow-lg p-12 min-h-96 flex items-center justify-center cursor-pointer"
            onClick={isRunning && showStimulus ? handleStimulusClick : undefined}
          >
            {!isRunning ? (
              <div className="text-center">
                <button
                  onClick={startTask}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-xl"
                >
                  課題開始
                </button>
              </div>
            ) : showStimulus ? (
              <div className="text-center">
                {/* 刺激表示 */}
                <div
                  className={`w-32 h-32 rounded-full mx-auto ${stimulusType === 'go' ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                ></div>
              </div>
            ) : isRunning ? (
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : null}
          </div>
          {isRunning && (
            <div className="mt-6 flex justify-center">
              <Button
                value="中止"
                onClick={handleStop}
              />
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
