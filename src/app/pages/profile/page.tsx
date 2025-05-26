"use client";
import React from "react";
import Description from "./description";
import Textbox, { TextboxProps } from "@/app/components/Textbox";
import Button, { ButtonProps } from "@/app/components/Button";
import { useRouter } from "next/navigation";

// const props: TextboxProps = {
//   placeholder: "ニックネームを入力してください",
//   size: "lg",
//   onFocus: () => console.log("Focused"),
// }

export default function Profile() {

  const router = useRouter();

  const buttonProps: ButtonProps = {
    value: "開始",
    onClick: () => {
      try {
        router.push("/pages/gonogo")
      } catch (error) {
        console.error("Error during button click:", error);
      }

    }
  }

  return (
    <div className="justify-center">
      <h1 className="text-2xl font-bold text-center mb-4">Go Nogo課題</h1>
      <section>
        <h2 className="text-xl font-semibold mb-3 text-blue-600">実施方法</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-6 text-lg text-gray-700 mb-8">
            {/* Go試行の説明 */}
            <div>
              <p className="mb-3">
                <span className="inline-block w-6 h-6 bg-blue-500 rounded-full mr-3"></span>
                青い円が表示されたら<strong>枠内をクリック</strong>してください
              </p>
              <div className="ml-9 mb-4">
                <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-8 relative">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-blue-600 text-sm font-semibold bg-white px-2 rounded border border-blue-300 mt-20">
                      ↑ 枠内どこでもクリック可能
                    </div>
                  </div>
                  {/* クリック可能エリアを示すアニメーション */}
                  <div className="absolute inset-2 border-2 border-blue-400 rounded-lg animate-pulse opacity-30"></div>
                </div>
              </div>
            </div>

            {/* NoGo試行の説明 */}
            <div>
              <p className="mb-3">
                <span className="inline-block w-6 h-6 bg-red-500 rounded-full mr-3"></span>
                赤い円が表示されたら<strong>何もしない</strong>でください
              </p>
              <div className="ml-9 mb-4">
                <div className="bg-white border-2 border-dashed border-red-300 rounded-lg p-8 relative">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-red-600 text-sm font-semibold bg-white px-2 rounded border border-red-300 mt-20">
                      ↑ クリック禁止
                    </div>
                  </div>
                  {/* 禁止マーク */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">×</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-yellow-800 mb-2">重要なポイント</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 枠内であればどこをクリックしても反応として記録されます</li>
                <li>• できるだけ速く、正確に反応してください</li>
                <li>• 円が消えた後のクリックは無効です</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* <span className="mr-3">ニックネーム</span> */}
      {/* <Textbox {...props}></Textbox> */}
      <div className="flex justify-center pt-3 pb-5">
        <Button {...buttonProps} />
      </div>
      <Description />

    </div>
  );
}
