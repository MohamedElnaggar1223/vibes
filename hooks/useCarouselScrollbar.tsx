import { useRef, useEffect, useState } from 'react';

export function useCarouselScrollbar(carouselRef: React.RefObject<HTMLElement>) {
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    const [scrollbarLeft, setScrollbarLeft] = useState(0);

    useEffect(() => {
        const updateScrollbar = () => {
            if (carouselRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                const scrollableWidth = scrollWidth - clientWidth;
                const newScrollbarWidth = (clientWidth / scrollWidth) * 100;
                const newScrollbarLeft = (scrollLeft / scrollableWidth) * (100 - newScrollbarWidth);

                setScrollbarWidth(newScrollbarWidth);
                setScrollbarLeft(newScrollbarLeft);
            }
        };

        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener('scroll', updateScrollbar);
            window.addEventListener('resize', updateScrollbar);
            updateScrollbar(); // Initial update
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('scroll', updateScrollbar);
            }
            window.removeEventListener('resize', updateScrollbar);
        };
    }, [carouselRef]);

    return { scrollbarWidth, scrollbarLeft };
}

