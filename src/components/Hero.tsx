
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  // Animation for the entire text
  const textContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
        staggerDirection: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 2
      }
    }
  };

  // Animation for individual letters
  const letterVariants = {
    initial: { 
      opacity: 0.3,
      y: 5,
      color: "#3b82f6"
    },
    animate: { 
      opacity: 1, 
      y: 0,
      color: "#2563eb",
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.5
      }
    }
  };

  const heroText = "SEOREH_TROPPUS";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 md:py-20 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-2"
      >
        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
          نظام العمل السعودي
        </span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
      >
        حاسبة <span className="text-primary">العمل الإضافي</span> لأبطال السبورت
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-xl text-muted-foreground max-w-3xl mb-10"
      >
        احتساب ساعات العمل الإضافي بدقة وسهولة وفقاً لنظام العمل السعودي. أدخل بيانات راتبك وساعات عملك الإضافية لمعرفة المبلغ المستحق.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-3xl relative"
      >
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/50 to-secondary-foreground/50 blur-md opacity-50"></div>
        <div className="relative h-20 w-full bg-white dark:bg-card rounded-xl flex items-center justify-center overflow-hidden shadow-xl">
          <motion.div 
            variants={textContainerVariants}
            initial="initial"
            animate="animate"
            className="flex items-center justify-center"
          >
            {heroText.split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block text-blue-500 font-extrabold text-4xl md:text-5xl"
                style={{ 
                  textShadow: "0 0 10px rgba(37,99,235,0.4)",
                  display: "inline-block",
                  letterSpacing: "0.05em"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
