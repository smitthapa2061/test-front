import React, { useState } from 'react';

interface Tournament {
  _id: string;
  tournamentName: string;
  torLogo?: string;
  day?: string;
  primaryColor?: string;
  secondaryColor?: string;
  overlayBg?: string;
}

interface Round {
  _id: string;
  roundName: string;
  apiEnable?: boolean;
  day?:string
}

interface Match {
  _id: string;
  matchName?: string;
  matchNo?: number;
  _matchNo?: number;
}

interface Player {
  _id: string;
  playerName: string;
  killNum: number;
  bHasDied: boolean;
  picUrl?: string;
  health: number;
  healthMax: number;
  liveState: number;
}

interface Team {
  _id: string;
  teamId?: string;
  teamTag: string;
  slot?: number;
  placePoints: number;
  players: Player[];
  teamLogo: string;
}

interface MatchData {
  _id: string;
  teams: Team[];
}

interface SlotsProps {
  tournament: Tournament;
  round?: Round | null;
  match?: Match | null;
  matchData?: MatchData | null;
}

const Slots: React.FC<SlotsProps> = ({ tournament, round, match, matchData }) => {
  
 

  if (!matchData || !matchData.teams) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center bg-black text-white">
        No match data available
      </div>
    );
  }
const boxW = 200; // desired width
const boxH = 200; // desired height
 const cols = 8;
  const teams = matchData.teams;
  const rows = 8;
  const totalSlots = rows * cols;
  const slots = Array.from({ length: totalSlots }, (_, i) => i < teams.length ? teams[i] : null);



 return (
  <div className="w-[1920px] h-[1080px]  ">
    <div
  style={{
   backgroundImage: `linear-gradient(135deg, ${
  tournament.primaryColor || '#000'
}, #000)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
  className="w-[1800px] h-[250px] text-[142px] font-[agencyb] absolute left-[140px]"
>
 TEAM PARTICIPATE

  
</div>
<div
 style={{
   backgroundImage: `linear-gradient(135deg, ${
  tournament.primaryColor || '#000'
}, #000)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
className="text-[78px] font-[agencyb] absolute left-[1340px] top-[0px]">
    {round?.roundName}
  </div>
<div className='text-black w-[400px] h-[200px] text-[78px] font-[agencyb] absolute left-[1310px] top-[70px]'>
DAY {round?.day} MATCH {match?.matchNo}

</div>


<div
  className="grid absolute top-[280px] left-[100px]"
  style={{
    gridTemplateColumns: `repeat(${cols}, ${boxW}px)`, // fixed width per column
    gridAutoRows: `${boxH}px`, // fixed height per row
    columnGap: '20px',  // horizontal spacing
    rowGap: '40px',     // vertical spacing
  }}
>
  {slots.map((team, index) => {
    if (!team) return null;

    return (
      <svg
      
        key={index}
        viewBox={`0 0 ${boxW} ${boxH}`}
        width={boxW}
        height={boxH}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
        <clipPath id={`cutTopLeft_${index}`}>
  <path 
    d={`
      M ${boxW * 0.125},0 
      Q 0,0 0,${boxH * 0.167} 
      L 0,${boxH} 
      L ${boxW},${boxH} 
      L ${boxW},0 
      Z
    `}
  />
</clipPath>
          <linearGradient id={`paint0_linear_${index}`} x1="0" y1="0" x2={boxW} y2={boxH} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF700"/>
            <stop offset="1"/>
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={boxW} height={boxH} fill="white" stroke="black" clipPath={`url(#cutTopLeft_${index})`} />
        <rect x="0" y={boxH - 43} width={boxW} height="53" fill={`url(#paint0_linear_${index})`} />
        <image x="20" y="10" width={boxW-30} height={boxH-50} href={team.teamLogo || "/def_logo.png"} clipPath={`url(#cutTopLeft_${index})`} />
        <text x={boxW / 2} y={boxH - 10} textAnchor="middle" fontSize="34" fill="white" fontFamily="AGENCYB">
      {team.teamTag}
        </text>
      </svg>
    );
  })}
</div>



  </div>
);

};

export default Slots;