'use client';

import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const DragHint = ({ isRTL }: { isRTL: boolean }) => {
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        const handleInteraction = () => {
            setShowHint(false);
        };

        window.addEventListener('mousedown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('mousedown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    if (!showHint) return null;

    return (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-[9999] animate-pulse max-lg:top-0">
            <div className="flex flex-col items-center gap-2">
                <div className="text-white text-sm font-medium">
                    {isRTL ? 'اسحب لليسار' : 'Swipe to see more'}
                </div>
                <div className="flex items-center gap-1 text-white animate-bounce">
                    <ChevronRight className="w-6 h-6" />
                    <ChevronRight className="w-6 h-6 -ml-4" />
                </div>
            </div>
        </div>
    );
};

export default DragHint;