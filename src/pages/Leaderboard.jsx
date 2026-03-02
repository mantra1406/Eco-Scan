import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users, Cloud, Scan, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../config/constants';

/**
 * Get rank icon based on position
 * @param {number} rank - Rank position
 * @returns {React.ReactNode} - Rank icon
 */
function getRankIcon(rank) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-eco-text-muted font-medium">{rank}</span>;
}

/**
 * Get color for letter avatar
 * @param {string} name - User name
 * @returns {string} - Color class
 */
function getAvatarColor(name) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Letter avatar component
 * @param {Object} props - Component props
 * @param {string} props.name - User name
 */
function LetterAvatar({ name }) {
  const letter = name.charAt(0).toUpperCase();
  const colorClass = getAvatarColor(name);

  return (
    <div
      className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-sm`}
    >
      {letter}
    </div>
  );
}

/**
 * User rank card component (for current user)
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {number} props.rank - User rank
 */
function UserRankCard({ user, rank }) {
  const isTop = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card
        className={`border-2 ${isTop ? 'border-yellow-400/50' : 'border-eco-accent/30'}`}
      >
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-eco-accent-dim flex items-center justify-center">
            {isTop ? (
              <Trophy className="w-6 h-6 text-yellow-400" />
            ) : (
              <span className="font-syne font-bold text-xl text-eco-accent">
                #{rank}
              </span>
            )}
          </div>

          {/* Avatar & Name */}
          <div className="flex items-center gap-3 flex-1">
            <LetterAvatar name={user.name} />
            <div>
              <div className="font-semibold text-eco-text">{user.name}</div>
              {isTop && (
                <div className="text-xs text-yellow-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Top Contributor!
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-right">
            <div>
              <div className="font-syne font-bold text-lg text-eco-accent">
                {user.scans}
              </div>
              <div className="text-xs text-eco-text-muted">Scans</div>
            </div>
            <div>
              <div className="font-syne font-bold text-lg text-eco-accent">
                {user.co2Saved.toFixed(1)}kg
              </div>
              <div className="text-xs text-eco-text-muted">CO₂</div>
            </div>
            <div>
              <div className="font-syne font-bold text-lg text-yellow-400">
                {user.greenPoints}
              </div>
              <div className="text-xs text-eco-text-muted">Points</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Leaderboard table row component
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {number} props.rank - User rank
 * @param {boolean} props.isCurrentUser - Whether this is the current user
 * @param {number} props.delay - Animation delay
 */
function LeaderboardRow({ user, rank, isCurrentUser, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.3 }}
      className={`
        flex items-center gap-4 p-4 rounded-xl
        ${isCurrentUser ? 'bg-eco-accent-dim border-l-4 border-eco-accent' : 'hover:bg-eco-surface2'}
        transition-colors
      `}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-10 text-center">
        {getRankIcon(rank)}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <LetterAvatar name={user.name} />
        <span className={`font-medium truncate ${isCurrentUser ? 'text-eco-accent' : 'text-eco-text'}`}>
          {user.name}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 sm:gap-8 text-right">
        <div className="hidden sm:block">
          <span className="text-eco-text font-medium">{user.scans}</span>
        </div>
        <div className="hidden md:block">
          <span className="text-eco-text font-medium">{user.co2Saved.toFixed(1)}kg</span>
        </div>
        <div className="w-16">
          <span className={`font-syne font-bold ${isCurrentUser ? 'text-yellow-400' : 'text-eco-accent'}`}>
            {user.greenPoints}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Stats summary component
 * @param {Object} props - Component props
 * @param {Array} props.leaderboardData - Leaderboard data
 */
function StatsSummary({ leaderboardData }) {
  const totals = leaderboardData.reduce(
    (acc, user) => ({
      scans: acc.scans + user.scans,
      co2Saved: acc.co2Saved + user.co2Saved,
      greenPoints: acc.greenPoints + user.greenPoints,
    }),
    { scans: 0, co2Saved: 0, greenPoints: 0 }
  );

  const stats = [
    { icon: <Scan className="w-5 h-5" />, label: 'Community Scans', value: totals.scans },
    { icon: <Cloud className="w-5 h-5" />, label: 'CO₂ Saved', value: `${totals.co2Saved.toFixed(1)}kg` },
    { icon: <Star className="w-5 h-5" />, label: 'Green Points', value: totals.greenPoints },
  ];

  return (
    <Card>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-2 text-eco-accent mb-1">
              {stat.icon}
            </div>
            <div className="font-syne font-bold text-xl text-eco-text">
              {stat.value}
            </div>
            <div className="text-xs text-eco-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Leaderboard page component
 */
export function Leaderboard() {
  const { currentUser, setUser, getUserStats } = useApp();
  const [showNameModal, setShowNameModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);

  // Check if user has name on mount
  useEffect(() => {
    if (!currentUser?.name) {
      setShowNameModal(true);
    }
  }, [currentUser]);

  // Build leaderboard data
  useEffect(() => {
    const realUserStats = currentUser?.name
      ? {
          name: currentUser.name,
          ...getUserStats(currentUser.name),
        }
      : null;

    // Merge mock users with real user
    const allUsers = [...MOCK_USERS];
    if (realUserStats && realUserStats.scans > 0) {
      allUsers.push(realUserStats);
    }

    // Sort by green points descending
    const sorted = allUsers.sort((a, b) => b.greenPoints - a.greenPoints);

    // Find user's rank
    if (realUserStats) {
      const rank = sorted.findIndex((u) => u.name === realUserStats.name) + 1;
      setUserRank(rank > 0 ? rank : sorted.length + 1);
    }

    setLeaderboardData(sorted);
  }, [currentUser, getUserStats]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (name) {
      setUser({ name, totalPoints: 0 });
      setShowNameModal(false);
    }
  };

  const realUserStats = currentUser?.name
    ? {
        name: currentUser.name,
        ...getUserStats(currentUser.name),
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">
            Green Leaderboard
          </span>
        </div>
        <h1 className="font-syne font-bold text-3xl text-eco-text mb-2">
          Compete for a Greener Future
        </h1>
        <p className="text-eco-text-muted">
          Earn points for proper waste segregation and climb the ranks
        </p>
      </motion.div>

      {/* User Rank Card */}
      {realUserStats && realUserStats.scans > 0 && userRank && (
        <div className="mb-8">
          <UserRankCard user={realUserStats} rank={userRank} />
        </div>
      )}

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          {/* Table Header */}
          <div className="flex items-center gap-4 p-4 border-b border-eco-border text-sm font-medium text-eco-text-muted">
            <div className="w-10 text-center">Rank</div>
            <div className="flex-1">User</div>
            <div className="hidden sm:block w-16 text-right">Scans</div>
            <div className="hidden md:block w-20 text-right">CO₂ Saved</div>
            <div className="w-16 text-right">Points</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-eco-border">
            {leaderboardData.map((user, index) => (
              <LeaderboardRow
                key={user.name}
                user={user}
                rank={index + 1}
                isCurrentUser={user.name === currentUser?.name}
                delay={index}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StatsSummary leaderboardData={leaderboardData} />
      </motion.div>

      {/* Name Modal */}
      <Modal
        isOpen={showNameModal}
        onClose={() => {}}
        title="Join the Leaderboard"
        showCloseButton={false}
      >
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <p className="text-eco-text-muted">
            Enter your name to compete with others and track your progress on the leaderboard.
          </p>
          <div>
            <label className="block text-sm font-medium text-eco-text mb-2">
              Your Name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-eco-surface2 border border-eco-border text-eco-text placeholder:text-eco-text-muted/50 focus:outline-none focus:ring-2 focus:ring-eco-accent"
            />
          </div>
          <Button type="submit" variant="primary" fullWidth>
            Join Leaderboard
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default Leaderboard;
