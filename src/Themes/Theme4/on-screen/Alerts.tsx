import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  rank?: number; // Team rank when eliminated
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

interface AlertsProps {
  tournament: Tournament;
  round?: Round | null;
  match?: Match | null;
  matchData?: MatchData | null;
}

const Alerts: React.FC<AlertsProps> = ({ tournament, round, match, matchData }) => {
  console.log('Alerts: Component mounted/updated with props:', { tournament: tournament?.tournamentName, round: round?.roundName, match: match?.matchName, matchDataId: matchData?._id });

  const [localMatchData, setLocalMatchData] = useState<MatchData | null>(matchData || null);
  const [matchDataId, setMatchDataId] = useState<string | null>(matchData?._id?.toString() || null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [socketStatus, setSocketStatus] = useState<string>('disconnected');
  const [updateCount, setUpdateCount] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentAlertTeam, setCurrentAlertTeam] = useState<Team | null>(null);
  const shownTeamsRef = useRef<Set<string>>(new Set());
  const [previousDataHash, setPreviousDataHash] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertIdRef = useRef<number>(0);
  const [displayedRank, setDisplayedRank] = useState<string>('');
  const [displayedKills, setDisplayedKills] = useState<string>('');
  const [displayedEliminated, setDisplayedEliminated] = useState<string>('');

  // Create a simple hash of the data for comparison
  const createDataHash = (data: any): string => {
    if (!data || !data.teams) return '';
    return data.teams.map((team: Team) =>
      team.players.map((p: Player) => `${p._id}-${p.killNum}-${p.bHasDied}-${p.liveState}-${p.health}`).join(',')
    ).join('|');
  };


  useEffect(() => {
    if (matchData) {
      console.log('Alerts: Received new matchData prop, updating local state');
      setLocalMatchData(matchData);
      setMatchDataId(matchData._id?.toString());
      setLastUpdateTime(Date.now());
      // Do not show alerts for initial dead players, only for new deaths via socket
      console.log('Alerts: MatchData updated, not triggering initial alert');
    }
  }, [matchData]);

  useEffect(() => {
    if (!matchDataId) {
      console.log('Alerts: Skipping socket setup - matchDataId missing', { matchDataId });
      return;
    }

    console.log('Alerts: Setting up real-time listeners for Alerts - matchData:', matchDataId);

    // Get a fresh socket connection from the manager
    const socketManager = SocketManager.getInstance();
    const freshSocket = socketManager.connect();

    console.log('Alerts: Socket connected:', freshSocket?.connected, 'ID:', freshSocket?.id);

    // Update initial status
    setSocketStatus(freshSocket?.connected ? 'connected' : 'disconnected');

    // Test socket connection
    freshSocket.emit('test', 'Alerts component connected');

    // Log all incoming events for debugging
    const debugHandler = (eventName: string, data: any) => {
      console.log(`Alerts: Received ${eventName}:`, data);
    };

    freshSocket.onAny(debugHandler);

    // Create unique event handler names to avoid conflicts with dashboard
    const alertsHandlers = {
      handleLiveUpdate: (data: any) => {
        console.log('Alerts: Received liveMatchUpdate for match:', data._id);

        // Check if this update is for the current match
        if (data._id?.toString() !== matchDataId) {
          console.log('Alerts: liveMatchUpdate not for current match, ignoring');
          return;
        }

        // Create hash of incoming data for comparison
        const newHash = createDataHash(data);

        console.log('Alerts: Data hash comparison - previous:', previousDataHash, 'new:', newHash);

        // Only process if data has actually changed
        if (previousDataHash !== newHash) {
          console.log('Alerts: Data has changed, processing update');
          // Process the update for this match
          if (data._id) {
            console.log('Alerts: Updating localMatchData with live API data');
            setLocalMatchData((prev: MatchData | null) => {
              const newData = data;
              // Check for team eliminations after update
              if (newData.teams) {
                for (const team of newData.teams) {
                  if (team.players.every((p: Player) => p.health === 0 || p.bHasDied || p.liveState === 5)) {
                    if (!shownTeamsRef.current.has(team._id)) {
                      console.log('Alerts: Team fully eliminated in liveMatchUpdate:', team.teamTag, '- showing alert');
                      shownTeamsRef.current.add(team._id);
                      setCurrentAlertTeam(team);
                      alertIdRef.current += 1;
                      setShowAlert(true);
                      setAnimating(true);
                      setTimeout(() => setAnimating(false), 500);
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      timeoutRef.current = setTimeout(() => {
                        console.log('Alerts: Auto-hiding alert after 5 seconds from liveMatchUpdate');
                        setShowAlert(false);
                        setCurrentAlertTeam(null);
                        timeoutRef.current = null;
                      }, 6000);
                      break; // Only show one alert at a time
                    } else {
                      console.log('Alerts: Team already shown:', team.teamTag, '- skipping');
                    }
                  }
                }
              }
              return newData;
            });
            setLastUpdateTime(Date.now());
            setUpdateCount(prev => prev + 1);
            setPreviousDataHash(newHash);
          }
        } else {
          console.log('Alerts: Data unchanged, skipping processing');
        }
      },

      handleMatchDataUpdate: (data: any) => {
        console.log('Alerts: Received matchDataUpdated:', data);
        if (data.matchDataId === matchDataId) {
          let newDeadPlayers: Player[] = [];
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) {
              console.log('Alerts: No prev matchData in matchDataUpdate, skipping');
              return prev;
            }
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
                    console.log('Alerts: Player', p._id, 'old bHasDied:', p.bHasDied, 'new:', (upd as Player)?.bHasDied);
                    if (upd && (upd as Player).bHasDied) {
                      newDeadPlayers.push(upd as Player);
                    }
                    return upd ? { ...p, ...upd } : p;
                  });
                }
                return nextTeam;
              }
              return team;
            });
            const updatedTeam = updatedTeams.find(t => t._id === data.teamId || t.teamId === data.teamId);
            if (updatedTeam && updatedTeam.players.every((p: Player) => p.health === 0 || p.bHasDied || p.liveState === 5)) {
              if (!shownTeamsRef.current.has(updatedTeam._id)) {
                console.log('Alerts: Team fully eliminated in matchDataUpdate:', updatedTeam.teamTag, 'setting alert');
                shownTeamsRef.current.add(updatedTeam._id);
                setCurrentAlertTeam(updatedTeam);
                alertIdRef.current += 1;
                setShowAlert(true);
                setAnimating(true);
                setTimeout(() => setAnimating(false), 500);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                  console.log('Alerts: Auto-hiding alert after 5 seconds from matchDataUpdate');
                  setShowAlert(false);
                  setCurrentAlertTeam(null);
                  timeoutRef.current = null;
                }, 6000);
              } else {
                console.log('Alerts: Team already shown:', updatedTeam.teamTag, '- skipping');
              }
            }
            return { ...prev, teams: updatedTeams };
          });
          // The check for team elimination is done in the setLocalMatchData function
          setLastUpdateTime(Date.now());
          setUpdateCount(prev => prev + 1);
        } else {
          console.log('Alerts: matchDataId mismatch in matchDataUpdate, ignoring');
        }
      },

      handlePlayerUpdate: (data: any) => {
        console.log('Alerts: Received playerStatsUpdated:', data);
        console.log('Alerts: Player update for player:', data.playerId, 'bHasDied in update:', data.updates?.bHasDied, 'matchDataId match:', data.matchDataId === matchDataId);
        if (data.matchDataId === matchDataId) {
          setLocalMatchData((prev: MatchData | null) => {
            if (!prev) {
              console.log('Alerts: No prev matchData, skipping update');
              return prev;
            }
            const newTeams = prev.teams.map((team: any) => {
              // Check both _id and teamId for team matching
              if (team._id === data.teamId || team.teamId === data.teamId) {
                return {
                  ...team,
                  players: team.players.map((player: Player) => {
                    if (player._id === data.playerId) {
                      const updatedPlayer = { ...player, ...data.updates };
                      console.log('Alerts: Updating player', player.playerName, 'old bHasDied:', player.bHasDied, 'new:', updatedPlayer.bHasDied);
                      return updatedPlayer;
                    }
                    return player;
                  }),
                };
              }
              return team;
            });
            const updatedTeam = newTeams.find(t => t._id === data.teamId || t.teamId === data.teamId);
            if (updatedTeam && updatedTeam.players.every((p: Player) => p.health === 0 || p.bHasDied || p.liveState === 5)) {
              if (!shownTeamsRef.current.has(updatedTeam._id)) {
                console.log('Alerts: Team fully eliminated:', updatedTeam.teamTag, 'setting alert');
                shownTeamsRef.current.add(updatedTeam._id);
                setCurrentAlertTeam(updatedTeam);
                alertIdRef.current += 1;
                setShowAlert(true);
                setAnimating(true);
                setTimeout(() => setAnimating(false), 500);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                  console.log('Alerts: Auto-hiding alert after 5 seconds from player update');
                  setShowAlert(false);
                  setCurrentAlertTeam(null);
                  timeoutRef.current = null;
                }, 6000);
              } else {
                console.log('Alerts: Team already shown:', updatedTeam.teamTag, '- skipping');
              }
            }
            return { ...prev, teams: newTeams };
          });
          setLastUpdateTime(Date.now());
        } else {
          console.log('Alerts: matchDataId mismatch, ignoring player update');
        }
      },

      handleTeamPointsUpdate: (data: any) => {
        console.log('Alerts: Received team points update:', data);
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
        console.log('Alerts: Received teamStatsUpdated:', data);
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
        console.log('Alerts: Received bulk team update:', data);
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
        console.log('Alerts: Socket connected');
        setSocketStatus('connected');
      },

      handleDisconnect: () => {
        console.log('Alerts: Socket disconnected');
        setSocketStatus('disconnected');
      }
    };

    // Listen to all relevant socket events with unique handlers
    freshSocket.on('liveMatchUpdate', alertsHandlers.handleLiveUpdate);
    freshSocket.on('matchDataUpdated', alertsHandlers.handleMatchDataUpdate);
    freshSocket.on('playerStatsUpdated', alertsHandlers.handlePlayerUpdate);
    freshSocket.on('teamPointsUpdated', alertsHandlers.handleTeamPointsUpdate);
    freshSocket.on('teamStatsUpdated', alertsHandlers.handleTeamStatsUpdate);
    freshSocket.on('bulkTeamUpdate', alertsHandlers.handleBulkTeamUpdate);
    freshSocket.on('connect', alertsHandlers.handleConnect);
    freshSocket.on('disconnect', alertsHandlers.handleDisconnect);

    return () => {
      console.log('Alerts: Cleaning up socket listeners');
      // Clean up debug handler
      freshSocket.offAny();

      // Clean up with the exact same handler references
      freshSocket.off('liveMatchUpdate', alertsHandlers.handleLiveUpdate);
      freshSocket.off('matchDataUpdated', alertsHandlers.handleMatchDataUpdate);
      freshSocket.off('playerStatsUpdated', alertsHandlers.handlePlayerUpdate);
      freshSocket.off('teamPointsUpdated', alertsHandlers.handleTeamPointsUpdate);
      freshSocket.off('teamStatsUpdated', alertsHandlers.handleTeamStatsUpdate);
      freshSocket.off('bulkTeamUpdate', alertsHandlers.handleBulkTeamUpdate);
      freshSocket.off('connect', alertsHandlers.handleConnect);
      freshSocket.off('disconnect', alertsHandlers.handleDisconnect);
      // Keep socket connected, just remove listeners
      // socketManager.disconnect();
    };
  }, [matchDataId]);

  // Add effect to handle prop changes and force re-render
  useEffect(() => {
    if (matchData && matchData._id?.toString() !== matchDataId) {
      console.log('MatchData prop changed, updating local state and resetting shown teams');
      setLocalMatchData(matchData);
      setMatchDataId(matchData._id?.toString());
      // Reset shown teams when component remounts or match changes
      shownTeamsRef.current.clear();
      setShowAlert(false);
      setCurrentAlertTeam(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [matchData, matchDataId]);

  // Sort teams by points first, then by kills - recalculated on every localMatchData change
  const sortedTeams = useMemo(() => {
    if (!localMatchData) return [];

    console.log('Alerts: Recalculating sortedTeams at', new Date(lastUpdateTime).toLocaleTimeString());

    return localMatchData.teams
      .map(team => ({
        ...team,
        totalKills: team.players.reduce((sum, p) => sum + (p.killNum || 0), 0),
        alive: team.players.filter(p => p.liveState !== 5).length,
        // Get team rank from players (all players in a team have the same rank when eliminated)
        teamRank: team.players.length > 0 ? (team.players[0].rank || 0) : 0,
      }))
      .sort((a, b) => {
        // Sort by points first (descending), then by kills (descending)
        if (b.placePoints !== a.placePoints) {
          return b.placePoints - a.placePoints;
        }
        return b.totalKills - a.totalKills;
      });
  }, [localMatchData, lastUpdateTime]);

  // Typing animation effect
  useEffect(() => {
    const alertTeam = currentAlertTeam ? sortedTeams.find(t => t._id === currentAlertTeam._id) : null;
    if (showAlert && alertTeam) {
      const rankText = `#${alertTeam.teamRank}`;
      const killsText = `${alertTeam.totalKills}`;
      const elimText = 'ELIMINATED';

      // Type rank
      for (let i = 0; i <= rankText.length; i++) {
        setTimeout(() => setDisplayedRank(rankText.slice(0, i)), i * 100);
      }

      // Type kills
      for (let i = 0; i <= killsText.length; i++) {
        setTimeout(() => setDisplayedKills(killsText.slice(0, i)), i * 100);
      }

      // Type eliminated
      for (let i = 0; i <= elimText.length; i++) {
        setTimeout(() => setDisplayedEliminated(elimText.slice(0, i)), i * 100);
      }
    } else {
      setDisplayedRank('');
      setDisplayedKills('');
      setDisplayedEliminated('');
    }
  }, [showAlert, currentAlertTeam, sortedTeams]);

  // Alerts component UI
  const alertPlayers = currentAlertTeam ? currentAlertTeam.players.filter(p => p.bHasDied) : [];
  const alertTeam = useMemo(() => currentAlertTeam ? sortedTeams.find(t => t._id === currentAlertTeam._id) : null, [currentAlertTeam, sortedTeams]);

  if (!localMatchData) {
    return null;
  }
  console.log('Alerts: Rendering with showAlert:', showAlert, 'currentAlertTeam:', currentAlertTeam?.teamTag, 'alertPlayers:', alertPlayers.map(p => p.playerName));
return (
  <AnimatePresence mode="wait">
    {showAlert && (
      <motion.div
        key={`alert-${alertIdRef.current}`}
        className="w-[1920px] h-[1080px] flex justify-center items-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="alertGradient" x1="0" y1="0" x2="1920" y2="0">
    <stop stopColor={tournament.primaryColor || '#E01515'} />
    <stop offset="1" stopColor={tournament.secondaryColor || '#620505'} />
  </linearGradient>
</defs>
<path d="M689 236H1176C1206.38 236 1231 260.624 1231 291V475H689V236Z" fill="#f0f0f0"/>
<rect x="697" y="354" width="515" height="3" fill="black"/>
<image href={alertTeam?.teamLogo} width="150" height="150" x="857" y="220"/>

       <text  fontFamily='AGENCYB' x="717" y="350" fill='url(#alertGradient)' fontSize={118}>{displayedRank}</text>
       <text  fontFamily='AGENCYB' x="995" y="350" fill='black' fontSize={118}>{displayedKills}</text>
         <text fontFamily='AGENCYB' x="1080" y="350" fill='black' fontSize={68}>ELIMS</text>
       <text  fontFamily='AGENCYB' x="727" y="460" fill='url(#alertGradient)' fontSize={118}>{displayedEliminated}

      
       </text>


</svg>
      </motion.div>
    )}
  </AnimatePresence>
);


};

export default Alerts;