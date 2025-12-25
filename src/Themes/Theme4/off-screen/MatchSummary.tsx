import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../login/api';

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
  day?: string;
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
  killNum?: number;
  assists?: number;
  knockouts?: number;
  killNumInVehicle?: number;
  killNumByGrenade?: number;
  headShotNum?: number;
  damage?: number;
  picUrl?: string;
}

interface Team {
  teamId: string;
  teamName: string;
  teamTag: string;
  teamLogo: string;
  slot: number;
  placePoints: number;
  players: Player[];
}

interface MatchData {
  _id: string;
  matchId: string;
  userId: string;
  teams: Team[];
}

interface MatchSummaryProps {
  tournament: Tournament;
  round?: Round | null;
  match?: Match | null;
  matchData?: MatchData;
}

const StatBox: React.FC<{ header: string; value: string | number; color?: string }> = ({
  header,
  value,
  color = '#ffffff',
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-[200px] h-[150px] m-[8px] p-2 rounded-md shadow-lg transform skew-x-10"
      style={{ backgroundColor: color }}
    >
      <div className="text-[20px] font-bold text-black mb-2">{header}</div>
      <div className="text-[36px] font-[AGENCYB] text-black">{value}</div>
    </div>
  );
};


const MatchSummary: React.FC<MatchSummaryProps> = ({ tournament, round, match, matchData: propMatchData }) => {
  const [matchData, setMatchData] = useState<MatchData | null>(propMatchData || null);
  const [loading, setLoading] = useState(!propMatchData);

  useEffect(() => {
    if (propMatchData) {
      setMatchData(propMatchData);
      setLoading(false);
    } else if (match?._id && !matchData) {
      const fetchMatchData = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/public/matches/${match._id}/matchdata`);
          setMatchData(res.data);
        } catch (err) {
          console.error('Failed to fetch match data:', err);
          setMatchData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchMatchData();
    }
  }, [match?._id, propMatchData, matchData]);

  const stats = useMemo(() => {
    if (!matchData) return null;

    let totalHeals = 0;
    let totalKnocks = 0;
    let totalAirdrops = 0;
    let totalDamage = 0;
    let totalRevives = 0;
    let longestDistElim = 0;
    let totalElims = 0;
    let matchDuration = 0;

    matchData.teams.forEach(team => {
      team.players.forEach(player => {
        totalHeals += Number(player.heals || 0);
        totalKnocks += Number(player.knockouts || 0);
        totalAirdrops += Number(player.airDropsLooted || 0);
        totalDamage += Number(player.damage || 0);
        totalRevives += Number(player.revives || 0);
        longestDistElim = Math.max(longestDistElim, Number(player.longestDistElim || 0));
        totalElims += Number(player.killNum || 0);
        matchDuration = Math.max(matchDuration, Number(player.matchDuration || 0));
      });
    });

    return {
      totalHeals,
      totalKnocks,
      totalAirdrops,
      totalDamage,
      totalRevives,
      longestDistElim,
      totalElims,
      matchDuration,
    };
  }, [matchData]);

  if (loading) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center">
        <div style={{ color: 'white', fontSize: '24px', fontFamily: 'Righteous' }}>Loading...</div>
      </div>
    );
  }

  if (!matchData || !stats) return null;

  const statBoxes = [
    { header: 'TOTAL HEAL', value: stats.totalHeals },
    { header: 'TOTAL KNOCKS', value: stats.totalKnocks },
    { header: 'AIR DROPS LOOTED', value: stats.totalAirdrops },
    { header: 'TOTAL DAMAGE', value: stats.totalDamage },
    { header: 'TOTAL REVIVES', value: stats.totalRevives },
    { header: 'LONGEST DIST. ELIMS', value: stats.longestDistElim },
    { header: 'TOTAL ELIMS', value: stats.totalElims },
    { header: 'TOTAL MATCH DURATION', value: stats.matchDuration },
    { header: 'PLACEHOLDER', value: '-' }, // You can replace with another stat
  ];

  return (
    <div className="w-[1920px] h-[1080px] bg-purple-800 flex flex-col items-center relative">
      {/* Titles */}
      <div className="w-[1500px] h-[250px] absolute top-[100px] flex">
        <div
          style={{
            backgroundImage: `linear-gradient(135deg, ${tournament.secondaryColor || '#000'}, #000)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="font-[AGENCYB] text-[150px]"
        >
          GAME SUMMARY
        </div>
        <div
          style={{
            backgroundImage: `linear-gradient(135deg, ${tournament.primaryColor || '#000'}, #000)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="font-[AGENCYB] text-[100px] absolute left-[1000px]"
        >
          {round?.roundName}
        </div>
        <div className="text-black font-[AGENCYB] text-[80px] absolute left-[1020px] top-[100px] w-[600px]">
          DAY {round?.day} - MATCH {match?.matchNo}
        </div>
      </div>
<div className="mt-[400px] flex flex-wrap justify-center w-[1000px] skew-x-[-10deg]">
  {statBoxes.map((stat, idx) => (
    <StatBox key={idx} header={stat.header} value={stat.value} color="#ffffff" />
  ))}
</div>

    </div>
  );
};

export default MatchSummary;



