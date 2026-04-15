import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for optimistic points updates
 * Updates points immediately in UI, then confirms/corrects with API response
 */
export function useOptimisticPoints() {
  const queryClient = useQueryClient();
  const [optimisticPoints, setOptimisticPoints] = useState<number | null>(null);

  /**
   * Add points optimistically (before API confirmation)
   */
  const addPointsOptimistically = useCallback((points: number) => {
    setOptimisticPoints(prev => (prev ?? 0) + points);
  }, []);

  /**
   * Confirm points with actual value from API
   * Corrects if estimate was wrong
   */
  const confirmPoints = useCallback((actualTotal: number) => {
    setOptimisticPoints(actualTotal);
    
    // Invalidate leaderboard queries to refetch with new points
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  }, [queryClient]);

  /**
   * Rollback optimistic update (if API fails)
   */
  const rollbackPoints = useCallback((pointsToRollback: number) => {
    setOptimisticPoints(prev => (prev ?? 0) - pointsToRollback);
  }, []);

  /**
   * Reset optimistic state
   */
  const resetOptimistic = useCallback(() => {
    setOptimisticPoints(null);
  }, []);

  return {
    optimisticPoints,
    addPointsOptimistically,
    confirmPoints,
    rollbackPoints,
    resetOptimistic,
  };
}

/**
 * Example usage in quiz component:
 * 
 * const { optimisticPoints, addPointsOptimistically, confirmPoints, rollbackPoints } = useOptimisticPoints();
 * 
 * const handleSubmit = async (answer: string) => {
 *   // Optimistic update - assume correct answer
 *   const estimatedPoints = question.points;
 *   addPointsOptimistically(estimatedPoints);
 *   
 *   try {
 *     const result = await submitAnswer(sessionId, questionId, answer);
 *     
 *     // Confirm with actual points from API
 *     confirmPoints(result.newTotal);
 *     
 *     // If estimate was wrong, UI will correct automatically
 *   } catch (error) {
 *     // Rollback on error
 *     rollbackPoints(estimatedPoints);
 *     toast.error('Failed to submit answer');
 *   }
 * };
 */
