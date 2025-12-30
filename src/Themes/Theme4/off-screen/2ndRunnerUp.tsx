import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../login/api.tsx';
import { motion } from 'framer-motion';

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
  day?: string;
}

interface Player {
  _id: string;
  uId: string;
  playerName: string;
  killNum: number;
  bHasDied: boolean;
  picUrl?: string;
  damage?: string;
  survivalTime?: number;
  assists?: number;

  // Aggregated stats
  health: number;
  healthMax: number;
  liveState: number;
}

interface Team {
  teamId: string;
  teamName: string;
  teamTag: string;
  teamLogo: string;
  slot: number;
  placePoints: number;
  wwcd?: number;
  players: Player[];
  matchesPlayed?: number;
}

interface Match {
  _id: string;
  matchName?: string;
  matchNo?: number;
}

interface MatchData {
  _id: string;
  teams: Team[];
}

interface OverallData {
  tournamentId: string;
  roundId: string;
  userId: string;
  teams: Team[];
  createdAt: string;
}

interface ChampionsProps {
  tournament: Tournament;
  round?: Round | null;
}

const SecondRunnerUp: React.FC<ChampionsProps> = ({ tournament, round }) => {
  const [overallData, setOverallData] = useState<OverallData | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchDatas, setMatchDatas] = useState<MatchData[]>([]);
  const [playerStats, setPlayerStats] = useState<Record<string, { killNum: number }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverall = async () => {
      if (!round) return;
      try {
        setLoading(true);

        // Initialize empty overall data structure
        const data: OverallData = {
          tournamentId: tournament._id,
          roundId: round._id,
          userId: '',
          teams: [],
          createdAt: new Date().toISOString()
        };

        // Try to get overall data, but don't fail if it doesn't exist
        try {
          const overallUrl = `/public/tournaments/${tournament._id}/rounds/${round._id}/overall`;
          const overallResponse = await api.get(overallUrl);
          Object.assign(data, overallResponse.data);
        } catch (overallError) {
          console.log('Overall data not available, using empty data structure');
        }

        setOverallData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch overall data:', err);
        setError('Failed to load overall data');
        setOverallData(null);
      } finally {
        setLoading(false);
      }
    };

    if (tournament._id && round?._id) fetchOverall();
  }, [tournament._id, round?._id]);

  const thirdPlace = useMemo(() => {
    if (!overallData) return null;

    const enriched = overallData.teams.map(team => {
      const totalKills = team.players.reduce((sum, p) => sum + Number(p.killNum || 0), 0);
      const total = Number(team.placePoints || 0) + totalKills;
      return { ...team, total, totalKills } as Team & { total: number; totalKills: number };
    });

    enriched.sort((a, b) => b.total - a.total);

    if (enriched.length < 3) return null;

    const third = enriched[2];
    const second = enriched[1];
    const leadOverNext = second ? (second.total as number) - third.total : third.total;

    return { ...third, leadOverNext } as (Team & { total: number; totalKills: number; leadOverNext: number });
  }, [overallData]);

  // Fetch player stats by UID
  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!thirdPlace || !round) return;

      try {
        // Get player stats for all players in the third place team
        const playerIds = thirdPlace.players.map((p: Player) => p._id);
         
        // Fetch player stats from API
        const statsPromises = playerIds.map((playerId: string) =>
          api.get(`/public/players/${playerId}/stats`)
        );
         
        const statsResponses = await Promise.all(statsPromises);
         
        // Create a map of player ID to their stats
        const statsMap: Record<string, { killNum: number }> = {};
        statsResponses.forEach((response: any, index: number) => {
          const playerId = playerIds[index];
          statsMap[playerId] = {
            killNum: response.data.killNum || 0
          };
        });
         
        setPlayerStats(statsMap);
      } catch (err) {
        console.error('Failed to fetch player stats:', err);
      }
    };

    if (thirdPlace && round?._id) {
      fetchPlayerStats();
    }
  }, [thirdPlace, round?._id]);

  if (loading) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center">
        <div className="text-white text-2xl font-[Righteous]">Loading...</div>
      </div>
    );
  }

  if (error || !overallData || !thirdPlace) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center">
        <div className="text-white text-2xl font-[Righteous]">{error || 'No overall data available'}</div>
      </div>
    );
  }

  return (
    <div
      className="w-[1920px] h-[1080px] text-white relative font-bebas-neue"
    >
      {/* Champions Title */}
      <div
        className="text-[140px] absolute top-[0px]  left-[370px]  font-[payBack]"
        style={{
          backgroundImage: `linear-gradient(to right, ${tournament.primaryColor}, ${tournament.secondaryColor})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        2ND RUNNER-UP
      </div>

      {/* Third Place Team Info */}
      <div
      style={{
          backgroundImage: `linear-gradient(to right, ${tournament.primaryColor}, ${"#000000"})`,
              }}
      className="top-[180px] flex justify-center items-center absolute left-[700px] font-[200] bg-white text-white pr-[25px]">
        <img
          src={thirdPlace.teamLogo || '/def_logo.png'}
          alt="Team Logo"
          className="w-[120px] h-[120px] object-contain relative top-[-6px] mr-6"
        />
        <div className="text-[64px] font-[AGENCYB]  ">{thirdPlace.teamName}</div>
      </div>

      <div
        style={{
          backgroundImage: `linear-gradient(to right, ${tournament.primaryColor}, ${"#000000"})`,
        }}
        className="text-[52px] text-white relative top-[950px] w-[900px] text-center left-[500px]  font-[AGENCYB]"
      >
     WWCD {thirdPlace.wwcd} -- KILLS {thirdPlace.totalKills}  -- {thirdPlace.placePoints} PLACE --  {thirdPlace.total} TOTAL
      </div>

      {/* Player Cards */}
      <motion.div
        className="absolute top-[390px] left-[200px] grid grid-cols-4 gap-[60px]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.4,
            },
          },
          hidden: {},
        }}
      >
       {thirdPlace.players.slice(0, 4).map((player: Player) => (

         <motion.div
         key={player._id}
            className="flex flex-col items-center bg-[#1a1a1a94]   rounded-2xl shadow-lg w-[340px]"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={player.picUrl || '/def_char.png'}
              alt={player.playerName}
              className="w-[620px] h-[420px] object-cover    top-[16px] "
            />
            <div
              style={{
          backgroundImage: `linear-gradient(to right, ${tournament.secondaryColor}, ${"#000000"})`,
              }}
              className="text-[44px] text-center w-[338px] font-[AGENCYB]"
            >
              {player.playerName}
            </div>
           
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SecondRunnerUp;
