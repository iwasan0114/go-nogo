import React from 'react';


export interface ButtonProps {
    onClick?: () => void;
    value: string;
}

export default function Button(props: ButtonProps) {
    const { onClick, value } = props;

    return (
        <div>
            <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {value}
            </button>
        </div>
    )
}