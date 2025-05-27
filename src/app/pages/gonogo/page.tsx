"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import Result from "./Result";

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
const TRIAL_COUNT = 10; // 総試行数
const GO_RATIO = 0.7;   // Go試行の割合
const STIMULUS_DURATION = 1000; // 刺激表示時間（ms）
const ITI_DURATION = 500; // 試行間間隔（ms）

export default function GoNogo() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [stimulusType, setStimulusType] = useState<'go' | 'nogo' | null>(null);
  const [showStimulus, setShowStimulus] = useState(false);
  const [results, setResults] = useState<TrialData[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 反応時間計測用
  const stimulusStartTime = useRef<number>(0);
  const trialsRef = useRef<('go' | 'nogo')[]>([]);
  const isExecutingRef = useRef(false);

  // useRefを使用してhasRespondedの状態を追跡
  const hasRespondedRef = useRef(false);

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

  // 次の試行を実行
  const runNextTrial = useCallback(() => {
    if (isExecutingRef.current) return; // 実行中なら早期リターン
    isExecutingRef.current = true;

    const trialType = trialsRef.current[currentTrial];
    console.log(`Starting trial ${currentTrial + 1}: ${trialType}`);

    // 試行間間隔
    setTimeout(() => {
      setStimulusType(trialType);
      setShowStimulus(true);
      hasRespondedRef.current = false; // refもリセット
      stimulusStartTime.current = Date.now();

      // 刺激表示時間後の処理
      setTimeout(() => {
        if (!hasRespondedRef.current) {
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
        
        // 次の試行への進行処理
        setTimeout(() => {
          const nextTrial = currentTrial + 1;
          
          if (nextTrial >= TRIAL_COUNT) {
            // 課題終了
            console.log('All trials completed!');
            setIsRunning(false);
            setShowResult(true);
            isExecutingRef.current = false;
          } else {
            // 次の試行へ
            setCurrentTrial(nextTrial);
            isExecutingRef.current = false; // フラグをリセット
          }
        }, 100);
      }, STIMULUS_DURATION);
    }, ITI_DURATION);
  }, [currentTrial]);

  // クリックイベントハンドラー
  const handleStimulusClick = useCallback(() => {
    if (!isRunning || !showStimulus || hasRespondedRef.current) return;

    const reactionTime = Date.now() - stimulusStartTime.current;
    const isCorrect = stimulusType === 'go';

    // refを先に更新
    // refを先に更新
    hasRespondedRef.current = true;
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
    console.log('Trial Result (Click):', trialData);
  }, [isRunning, showStimulus, stimulusType, currentTrial]);

  // 課題開始
  const startTask = () => {
    console.log('Starting task...');
    setIsRunning(true);
    setCurrentTrial(0);
    setResults([]);
    setShowResult(false);
    isExecutingRef.current = false; // フラグをリセット
    trialsRef.current = generateTrials();
    
    // 最初の試行を開始
    setTimeout(() => {
      setCurrentTrial(0);
      runNextTrial();
    }, 100);
  };

  // 試行番号が変わったら次の試行を実行
  useEffect(() => {
    console.log("useEffect triggered - isRunning:", isRunning, "currentTrial:", currentTrial, "isExecuting:", isExecutingRef.current);
    
    if (isRunning && currentTrial > 0 && currentTrial < TRIAL_COUNT && !isExecutingRef.current) {
      console.log('Triggering next trial from useEffect');
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

  const handleReturnToProfile = () => {
    router.push("/pages/profile");
  };

  // 結果表示の場合
  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <Result results={results} onReturnToProfile={handleReturnToProfile} />
        </div>
      </div>
    );
  }

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
            {!isRunning && results.length < TRIAL_COUNT ? (
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
