import Link from 'next/link';
import React from 'react';
import styles from './landing.module.css';

const Landing = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to AI Resume Builder</h1>
      <p className={styles.subtitle}>
        Create professional resumes effortlessly with AI-powered assistance.
      </p>
      <Link href="/signup">
        <button className={styles.button}>Get Started</button>
      </Link>
      
    </div>
  );
};

export default Landing;
