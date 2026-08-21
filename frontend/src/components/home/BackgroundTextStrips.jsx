import React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

function TickerRow({ text, rotateClass, speedClass, textStyleClass, translateValue }) {
  // Repeat the text to ensure it covers the viewport width
  const fullText = `${text} ${text} ${text} ${text}`;

  return (
    <motion.div 
      style={{ x: translateValue }}
      className={`absolute w-[150%] left-[-25%] py-4 flex flex-row overflow-hidden whitespace-nowrap pointer-events-none select-none font-display font-black text-6xl md:text-8xl tracking-wider ${rotateClass}`}
    >
      {/* 
        Marquee wrapper. We duplicate the content to ensure seamless loop.
        The CSS animate-marquee translates from 0% to -50%.
      */}
      <div className={`${speedClass} flex flex-row gap-8`}>
        <span className={textStyleClass}>{fullText}</span>
        <span className={textStyleClass} aria-hidden="true">{fullText}</span>
      </div>
    </motion.div>
  );
}

export default function BackgroundTextStrips() {
  const { scrollYProgress } = useScroll();

  // Scroll translations for parallax effect (moves opposite to layout for added depth)
  const translateRow1 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const translateRow2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const translateRow3 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const translateRow4 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      
      {/* Row 1: Near the top (Hero section area) */}
      <div className="absolute top-[18vh] w-full">
        <TickerRow 
          text="QUEST ACADEMY • LEVEL UP • CHOOSE PROGRESS •"
          rotateClass="rotate-[-4deg]"
          speedClass="animate-marquee"
          textStyleClass="text-stroke-berry font-extrabold"
          translateValue={translateRow1}
        />
      </div>

      {/* Row 2: Upper middle (Problem section area) */}
      <div className="absolute top-[42vh] w-full">
        <TickerRow 
          text="GAME ON • MOTIVATE • ENGAGE • EXPLORE •"
          rotateClass="rotate-[3deg]"
          speedClass="animate-marquee-reverse"
          textStyleClass="text-theme-plum/4 font-black"
          translateValue={translateRow2}
        />
      </div>

      {/* Row 3: Lower middle (Idea section area) */}
      <div className="absolute top-[68vh] w-full">
        <TickerRow 
          text="XP GAINED • REWARD LOOPS • MASTER CLASS •"
          rotateClass="rotate-[-3deg]"
          speedClass="animate-marquee"
          textStyleClass="text-stroke-plum font-extrabold"
          translateValue={translateRow3}
        />
      </div>

      {/* Row 4: Bottom (Impact/CTA section area) */}
      <div className="absolute top-[88vh] w-full">
        <TickerRow 
          text="ACHIEVE MORE • LEARN BY PLAYING • CONQUER GOALS •"
          rotateClass="rotate-[5deg]"
          speedClass="animate-marquee-reverse"
          textStyleClass="text-theme-berry/4 font-black"
          translateValue={translateRow4}
        />
      </div>
      
    </div>
  );
}
