
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import OvertimeCalculator from '@/components/OvertimeCalculator';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <Layout>
      <Hero />
      
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        <OvertimeCalculator />
      </motion.div>
    </Layout>
  );
};

export default Index;
