import React, { useEffect, useState, useMemo } from 'react';
import SocketManager from '../../../dashboard/socketManager.tsx';

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

  // Live stats fields
  health: number;
  healthMax: number;
  liveState: number; // 0 = knocked, 5 = dead, etc.
}

interface Team {
  _id: string;
  teamTag: string;
  slot?: number;
  placePoints: number;
  players: Player[];
  teamLogo:string;
}

interface MatchData {
  _id: string;
  teams: Team[];
}

interface UpperProps {
  tournament: Tournament;
  round?: Round | null;
  match?: Match | null;
  matchData?: MatchData | null;
}

const Upper: React.FC<UpperProps> = ({ tournament, round, match, matchData }) => {
  const [localMatchData, setLocalMatchData] = useState<MatchData | null>(matchData || null);
  const [matchDataId, setMatchDataId] = useState<string | null>(matchData?._id?.toString() || null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [socketStatus, setSocketStatus] = useState<string>('disconnected');
  const [updateCount, setUpdateCount] = useState<number>(0);

  useEffect(() => {
    if (matchData) {
      console.log('Upper: Received new matchData prop, updating local state');
      setLocalMatchData(matchData);
      setMatchDataId(matchData._id?.toString());
      setLastUpdateTime(Date.now());
    }
  }, [matchData]);

  useEffect(() => {
    if (!match?._id || !matchDataId) return;

    console.log('Setting up real-time listeners for Upper - match:', match._id, 'matchData:', matchDataId);

    // Get a fresh socket connection from the manager
    const socketManager = SocketManager.getInstance();
    const freshSocket = socketManager.connect();

    console.log('Socket connected:', freshSocket?.connected);
    console.log('Socket ID:', freshSocket?.id);

    // Update initial status
    setSocketStatus(freshSocket?.connected ? 'connected' : 'disconnected');

    // Test socket connection
    freshSocket.emit('test', 'Upper component connected');

    // Log all incoming events for debugging
    const debugHandler = (eventName: string, data: any) => {
      console.log(`Upper: Received ${eventName}:`, data);
    };

    freshSocket.onAny(debugHandler);

    // Create unique event handler names to avoid conflicts with dashboard
    const upperHandlers = {
      handleLiveUpdate: (data: any) => {
        console.log('Upper: Received liveMatchUpdate for match:', data._id);

        // Check if this update is for the current matchData
        if (data._id?.toString() !== matchDataId) {
          console.log('Upper: liveMatchUpdate not for current matchData, ignoring');
          return;
        }

        console.log('Upper: Updating localMatchData with live API data');
        setLocalMatchData(data);
        setLastUpdateTime(Date.now());
        setUpdateCount(prev => prev + 1);
      },

      handleMatchDataUpdate: (data: any) => {
        console.log('Upper: Received matchDataUpdated:', data);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) return prev;
            const updatedTeams = prev.teams.map((team: any) => {
              // Check both _id and teamId for team matching
              if (team._id === data.teamId || team.teamId === data.teamId) {
                const changes = data.changes || {};
                const nextTeam: any = { ...team, ...changes };
                if (Array.isArray(changes.players)) {
                  const updatesById = new Map(
                    changes.players.map((p: any) => [p._id?.toString?.() || p._id, p])
                  );
                  nextTeam.players = team.players.map((p: Player) => {
                    const key = p._id?.toString?.() || p._id;
                    const upd = updatesById.get(key);
                    return upd ? { ...p, ...upd } : p;
                  });
                }
                return nextTeam;
              }
              return team;
            });
            return { ...prev, teams: updatedTeams };
          });
          setLastUpdateTime(Date.now());
          setUpdateCount(prev => prev + 1);
        }
      },

      handlePlayerUpdate: (data: any) => {
        console.log('Upper: Received playerStatsUpdated:', data);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              teams: prev.teams.map((team: any) => {
                // Check both _id and teamId for team matching
                if (team._id === data.teamId || team.teamId === data.teamId) {
                  return {
                    ...team,
                    players: team.players.map((player: Player) =>
                      player._id === data.playerId
                        ? { ...player, ...data.updates }
                        : player
                    ),
                  };
                }
                return team;
              }),
            };
          });
          setLastUpdateTime(Date.now());
        }
      },

      handleTeamPointsUpdate: (data: any) => {
        console.log('Upper: Received team points update:', data);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              teams: prev.teams.map((team: any) => {
                // Check both _id and teamId for team matching
                if (team._id === data.teamId || team.teamId === data.teamId) {
                  return {
                    ...team,
                    placePoints: data.changes?.placePoints ?? team.placePoints,
                  };
                }
                return team;
              }),
            };
          });
          setLastUpdateTime(Date.now());
        }
      },

      handleTeamStatsUpdate: (data: any) => {
        console.log('Upper: Received teamStatsUpdated:', data);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              teams: prev.teams.map((team: any) => {
                // Check both _id and teamId for team matching
                if (team._id === data.teamId || team.teamId === data.teamId) {
                  // Update player kill numbers if provided
                  const updatedPlayers = data.players ?
                    team.players.map((player: any) => {
                      const playerUpdate = data.players.find((p: any) => p._id === player._id);
                      return playerUpdate ? { ...player, killNum: playerUpdate.killNum } : player;
                    }) : team.players;

                  return {
                    ...team,
                    players: updatedPlayers,
                  };
                }
                return team;
              }),
            };
          });
          setLastUpdateTime(Date.now());
        }
      },

      handleBulkTeamUpdate: (data: any) => {
        console.log('Upper: Received bulk team update:', data);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              teams: prev.teams.map((team: any) => {
                // Check both _id and teamId for team matching
                if ((team._id === data.teamId || team.teamId === data.teamId) && data.changes?.players) {
                  const playerUpdates = new Map(
                    data.changes.players.map((p: any) => [p._id?.toString?.() || p._id, p])
                  );
                  return {
                    ...team,
                    players: team.players.map((player: Player) => {
                      const key = player._id?.toString?.() || player._id;
                      const update = playerUpdates.get(key);
                      return update ? { ...player, ...update } : player;
                    }),
                  };
                }
                return team;
              }),
            };
          });
          setLastUpdateTime(Date.now());
        }
      },

      handleConnect: () => {
        console.log('Upper: Socket connected');
        setSocketStatus('connected');
      },

      handleDisconnect: () => {
        console.log('Upper: Socket disconnected');
        setSocketStatus('disconnected');
      }
    };

    // Listen to all relevant socket events with unique handlers
    freshSocket.on('liveMatchUpdate', upperHandlers.handleLiveUpdate);
    freshSocket.on('matchDataUpdated', upperHandlers.handleMatchDataUpdate);
    freshSocket.on('playerStatsUpdated', upperHandlers.handlePlayerUpdate);
    freshSocket.on('teamPointsUpdated', upperHandlers.handleTeamPointsUpdate);
    freshSocket.on('teamStatsUpdated', upperHandlers.handleTeamStatsUpdate);
    freshSocket.on('bulkTeamUpdate', upperHandlers.handleBulkTeamUpdate);
    freshSocket.on('connect', upperHandlers.handleConnect);
    freshSocket.on('disconnect', upperHandlers.handleDisconnect);

    return () => {
      console.log('Upper: Cleaning up socket listeners');
      // Clean up debug handler
      freshSocket.offAny();

      // Clean up with the exact same handler references
      freshSocket.off('liveMatchUpdate', upperHandlers.handleLiveUpdate);
      freshSocket.off('matchDataUpdated', upperHandlers.handleMatchDataUpdate);
      freshSocket.off('playerStatsUpdated', upperHandlers.handlePlayerUpdate);
      freshSocket.off('teamPointsUpdated', upperHandlers.handleTeamPointsUpdate);
      freshSocket.off('teamStatsUpdated', upperHandlers.handleTeamStatsUpdate);
      freshSocket.off('bulkTeamUpdate', upperHandlers.handleBulkTeamUpdate);
      freshSocket.off('connect', upperHandlers.handleConnect);
      freshSocket.off('disconnect', upperHandlers.handleDisconnect);
      // Notify socket manager that this component is done with the socket
      socketManager.disconnect();
    };
  }, [match?._id, matchDataId]);

  // Add effect to handle prop changes and force re-render
  useEffect(() => {
    if (matchData && matchData._id?.toString() !== matchDataId) {
      console.log('MatchData prop changed, updating local state');
      setLocalMatchData(matchData);
      setMatchDataId(matchData._id?.toString());
    }
  }, [matchData, matchDataId]);

  // Get top 5 teams by alive players - recalculated on every localMatchData change
  const topTeams = useMemo(() => {
    if (!localMatchData) return [];

    console.log('Upper: Recalculating topTeams at', new Date(lastUpdateTime).toLocaleTimeString());

    const useApiHealth = round?.apiEnable === true;

    return localMatchData.teams
      .map(team => {
        const aliveCount = team.players.filter(p => !p.bHasDied).length;
        let wwcd: number;
        if (useApiHealth) {
          // API enabled - use health sum / 4
          wwcd = Math.round(team.players.reduce((sum, p) => sum + (p.health || 0), 0) / 4);
        } else {
          // API disabled - count alive players (not bHasDied) * 25
          wwcd = Math.round(aliveCount * 25);
        }
        return {
          ...team,
          totalKills: team.players.reduce((sum, p) => sum + (p.killNum || 0), 0),
          aliveCount,
          wwcd,
        };
      })
      .filter(team => team.aliveCount > 0) // Only teams with alive players
      .sort((a, b) => b.aliveCount - a.aliveCount)
      .slice(0, 5);
  }, [localMatchData, lastUpdateTime, round?.apiEnable]);

  if (!localMatchData) {
    return (
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="1600" y="350" fontFamily="Arial" fontSize="24" fill="white">No match data</text>
      </svg>
    );
  }

 return (
  <svg
    width="1920"
    height="1080"
    viewBox="0 0 1920 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="paint0_linear_2096_15"
        x1="508.5"
        y1="110"
        x2="356.443"
        y2="-68.2287"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={tournament.primaryColor || "#FFCC16"} />
        <stop offset="1" />
      </linearGradient>

      <linearGradient
        id="paint1_linear_2096_15"
        x1="301.5"
        y1="83.75"
        x2="561"
        y2="137"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={tournament.secondaryColor || "#FF6800"} />
        <stop offset="1" stopColor={tournament.primaryColor || "#FFCC16"} />
      </linearGradient>
    </defs>

    {topTeams.slice(0, 4).map((team, index) => {
      const CARD_W = 297;
      const GAP = 30;
      const TOTAL_W = 4 * CARD_W + 3 * GAP;
      const startX = (1920 - TOTAL_W) / 2;
      const baseX = startX + index * (CARD_W + GAP);
      const tx = baseX - 297;

      const useApiHealth = round?.apiEnable === true;
      const primaryColor = tournament.primaryColor || "#fc030f";
      const secondaryColor = tournament.secondaryColor || "#fff600";

      return (
        <g key={team._id} transform={`translate(${tx}, 0)`}>
          {/* Header */}
          <path
            d="M594.699 55.5L594.491 57.6895L589.491 110.189L589.318 112H299.342L299.506 109.848L303.506 57.3477L303.646 55.5H594.699Z"
            fill="url(#paint0_linear_2096_15)"
            stroke="url(#paint1_linear_2096_15)"
            strokeWidth="4"
          />

          {/* Body */}
          <path
            d="M297.124 120L293 151H587.845L593 120H297.124Z"
            fill="#D9D9D9"
          />

          <image x="313" y="60" width="50" height="50" href={team.teamLogo} />
          <text
            x="363"
            y="103"
            fontFamily="AGENCYB"
            fontSize="44"
            fill="white"
          >
            {team.teamTag}
          </text>

          {/* PLAYER HEALTH BARS */}
          {team.players.slice(0, 4).map((player, i) => {
            const barX = 513 + i * 13;
            const barY = 62;
            const barW = 10;
            const barH = 45;

            const isDead = player.liveState === 5 || player.bHasDied;
            const isKnocked = player.liveState === 4;
            const isAlive = [0, 1, 2, 3].includes(player.liveState);

            let barHeight = 0;
            let barColor = "";

            if (useApiHealth) {
              if (!isDead) {
                const ratio = Math.max(
                  0,
                  Math.min(1, player.health / (player.healthMax || 100))
                );
                barHeight = ratio * barH;
                barColor = isKnocked
                  ? primaryColor
                  : isAlive
                  ? secondaryColor
                  : "";
              }
            } else {
              if (!isDead) {
                barHeight = barH;
                barColor = isKnocked ? primaryColor : secondaryColor;
              }
            }

            return (
              <g key={player._id}>
                {/* Background */}
                <rect
                  x={barX}
                  y={barY}
                  width={barW}
                  height={barH}
                  fill="#4b5563"
                
                />

                {/* Health */}
                {barHeight > 0 && (
                  <rect
                    x={barX}
                    y={barY + (barH - barHeight)}
                    width={barW}
                    height={barHeight}
                    fill={barColor}
                 
                    style={{
                      transition: "height 0.3s ease, y 0.3s ease",
                    }}
                  />
                )}
              </g>
            );
          })}
        </g>
      );
    })}
  </svg>
);





};

export default Upper;