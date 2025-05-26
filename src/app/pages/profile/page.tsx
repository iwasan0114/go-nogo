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
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p><span className="inline-block w-6 h-6 bg-blue-500 rounded-full mr-3"></span>青い円が表示されたら<strong>クリック</strong>してください</p>
            <p><span className="inline-block w-6 h-6 bg-red-500 rounded-full mr-3"></span>赤い円が表示されたら<strong>何もしない</strong>でください</p>
            <p className="text-sm text-gray-500 mt-4">できるだけ速く、正確に反応してください</p>
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
