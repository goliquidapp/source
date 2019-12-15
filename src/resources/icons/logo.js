import React from "react";
import { SvgXml } from 'react-native-svg';

const xml=`
	<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="188"
      height="188"
      viewBox="0 0 188 188"
    >
      <defs>
        <filter
          id="a"
          width="180.5%"
          height="180.5%"
          x="-40.2%"
          y="-38.7%"
          filterUnits="objectBoundingBox"
        >
          <feOffset
            dy="2"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation="5.5"
          ></feGaussianBlur>
          <feColorMatrix
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#26B8FF"></stop>
          <stop offset="100%" stopColor="#8411FF"></stop>
        </linearGradient>
        <path
          id="c"
          d="M56.119 127.038c4.201.744 33.793 5.473 55.296-15.817 22.293-22.072 15.964-52.38 15.11-56.138-5.289-23.274-22.865-35.744-30.472-41.14C87.843 8.116 75.903-.398 59.166.013 38.548.521 25.378 13.528 19.377 19.377c-5.006 4.88-16.746 16.66-19.005 35.37-1.954 16.19 4.275 28.572 7.365 34.51 2.575 4.952 16.667 32.164 48.382 37.781z"
        ></path>
        <filter
          id="b"
          width="159.4%"
          height="159.4%"
          x="-29.7%"
          y="-28.1%"
          filterUnits="objectBoundingBox"
        >
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="2.5"
            result="shadowSpreadOuter1"
          ></feMorphology>
          <feOffset
            dy="2"
            in="shadowSpreadOuter1"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation="11.5"
          ></feGaussianBlur>
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          ></feComposite>
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
          ></feColorMatrix>
        </filter>
      </defs>
      <g
        fill="none"
        fillRule="evenodd"
        stroke="none"
        strokeWidth="1"
        filter="url(#a)"
        transform="translate(-94 -51) translate(124 77)"
      >
        <use fill="#000" filter="url(#b)" xlinkHref="#c"></use>
        <use fill="url(#d)" stroke="#FFF" strokeWidth="5" xlinkHref="#c"></use>
        <path
          fill="#FFF"
          d="M83.357 80.966c-3.794 7.048-1.21 17.569 4.545 19.6 5.278 1.863 11.776-3.924 14.638-8.933 2.923-5.116 4.495-13.694.341-17.269-4.67-4.02-15.531-.816-19.524 6.602z"
        ></path>
      </g>
    </svg>
   `;

export default (props) => <SvgXml xml={xml} width={props.width} height={props.height} />;