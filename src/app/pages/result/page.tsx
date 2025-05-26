"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import Button from '@/app/components/Button';

export default function ResultPage() {
    const router = useRouter();
    return (
        <div className="m-4 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">課題完了！</h3>
            <p className="text-green-700 mb-4">お疲れさまでした。結果が記録されました。</p>
            <Button
                onClick={() => router.push("/pages/profile")}
                value="プロフィールに戻る"
            />
        </div>
    );
}