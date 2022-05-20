import React from 'react';
import './GradientText.css';

type IGradientTextProps = {
  className: string;
  text: string;
};

const GradientText: React.FC<IGradientTextProps> = ({
  className = '',
  text
}) => {
  return <div className={`gradient-text ${className}`}>{text}</div>;
};

export default GradientText;
