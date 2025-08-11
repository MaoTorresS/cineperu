import React from "react";

const DefaultUserImg: React.FC<{ size?: number }> = ({ size = 35 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <circle cx="20" cy="20" r="20" fill="#888" />
    <circle cx="20" cy="15" r="7" fill="#ccc" />
    <ellipse cx="20" cy="29" rx="11" ry="7" fill="#bbb" />
  </svg>
);

export default DefaultUserImg;
