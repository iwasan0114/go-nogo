import React from "react";
import Description from "./description";
import Textbox, { TextboxProps } from "@/app/components/Textbox";
import Button, { ButtonProps } from "@/app/components/Button";

const props: TextboxProps = {
  placeholder: "ニックネームを入力してください",
  size: "lg",
  onFocus: () => console.log("Focused"),
}

const buttonProps: ButtonProps = {
  value: "開始", 
  onClick: () => console.log("Button clicked"),
}

export default function Page() {
  return (
    <div className="justify-center">
      <h1 className="text-2xl font-bold text-center mb-4">Go Nogo課題</h1>
      <Description />
      <form>
        {/* <span className="mr-3">ニックネーム</span> */}
        {/* <Textbox {...props}></Textbox> */}
        <div className="flex justify-center py-3">
          <Button {...buttonProps}/>
        </div>
      </form>

    </div>
  );
}
