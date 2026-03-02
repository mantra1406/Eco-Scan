import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

/**
 * 404 Not Found page
 */
export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <Card className="border-eco-accent/20">
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-8xl mb-4"
            >
              🌱
            </motion.div>
            <h1 className="font-syne font-bold text-7xl text-eco-accent mb-2">
              404
            </h1>
            <p className="text-xl text-eco-text-muted">
              Page not found
            </p>
          </div>

          {/* Message */}
          <div className="mb-8">
            <p className="text-eco-text-muted">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </button>
          </div>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-eco-text-muted"
        >
          EcoScan — AI-Powered Sustainability Platform
        </motion.p>
      </motion.div>
    </div>
  );
}

export default NotFound;
