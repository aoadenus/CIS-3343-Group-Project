import { motion } from 'motion/react';

export function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8EBD7',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <motion.h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '3rem',
            fontWeight: 700,
            color: '#C44569',
            marginBottom: '1rem',
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
        >
          Emily Bakes Cakes
        </motion.h1>
        <motion.p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '1.25rem',
            color: '#2B2B2B',
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
        >
          Welcome
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
