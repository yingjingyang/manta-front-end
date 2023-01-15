import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import { useState, useEffect } from 'react';

const PROGRESS_MAX = 251.327;

const Progress = () => {
  const [progress, setProgress] = useState(0);
  const { setCurrentStep } = useSBT();
  useEffect(() => {
    if (progress >= PROGRESS_MAX) {
      setCurrentStep(Step.Generated);
      return;
    }
    const timer = setInterval(() => {
      setProgress(Math.min(PROGRESS_MAX, progress + 50));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [progress, setCurrentStep]);

  return (
    <div className="relative w-72 h-72 mt-6 leading-6 text-center">
      <svg
        className="CircularProgressbar "
        viewBox="0 0 100 100"
        data-test-id="CircularProgressbar">
        <path
          className="CircularProgressbar-trail"
          d="
M 50,50
m 0,-40
a 40,40 0 1 1 0,80
a 40,40 0 1 1 0,-80
"
          strokeWidth="6"
          fillOpacity="0"
          style={{
            stroke: 'rgb(5, 13, 50)',
            strokeDasharray: '251.327px, 251.327px',
            strokeDashoffset: '0px'
          }}></path>
        <path
          className="CircularProgressbar-path"
          d="
M 50,50
m 0,-40
a 40,40 0 1 1 0,80
a 40,40 0 1 1 0,-80
"
          strokeWidth="6"
          fillOpacity="0"
          style={{
            stroke: 'url("#hello")',
            height: '100%',
            strokeDasharray: '251.327px, 251.327px',
            strokeDashoffset: `${progress}px`,
            strokeLinecap: 'round'
          }}></path>
        <defs>
          <linearGradient id="hello" gradientTransform="rotate(90)">
            <stop offset="16.29%" stopColor="#2b49ea"></stop>
            <stop offset="85.56%" stopColor="#00afa5"></stop>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-white text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span>Remaining</span>
        <h2 className="text-5xl">19</h2>
        <span>min</span>
      </div>
    </div>
  );
};

export default Progress;
