import { useState, useEffect, useCallback, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import { EMISSION_FACTORS, CATEGORY_WEIGHTS } from '../config/constants';

/**
 * Custom hook for managing the Teachable Machine model
 * @param {string} modelUrl - URL to the Teachable Machine model
 * @returns {Object} - Model state and classification function
 */
export function useModel(modelUrl) {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);

  // Load the model on mount
  useEffect(() => {
    const loadModel = async () => {
      // If no model URL provided, enable simulation mode
      if (!modelUrl || modelUrl.trim() === '') {
        setSimulationMode(true);
        setIsReady(true);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const modelURL = modelUrl + '/model.json';
        const metadataURL = modelUrl + '/metadata.json';

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        modelRef.current = loadedModel;
        setModel(loadedModel);
        setIsReady(true);
        setSimulationMode(false);
      } catch (err) {
        console.warn('Failed to load Teachable Machine model:', err);
        setSimulationMode(true);
        setIsReady(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    // Cleanup
    return () => {
      if (modelRef.current) {
        // Teachable Machine models don't have explicit cleanup, but we clear the ref
        modelRef.current = null;
      }
    };
  }, [modelUrl]);

  /**
   * Get a random category based on weighted distribution
   * @returns {string} - Random category
   */
  const getWeightedRandomCategory = useCallback(() => {
    const rand = Math.random();
    let cumulative = 0;

    for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return category;
      }
    }

    return 'Plastic';
  }, []);

  /**
   * Generate realistic fake predictions for simulation mode
   * @returns {Array} - Array of prediction objects
   */
  const generateFakePredictions = useCallback(() => {
    const categories = Object.keys(EMISSION_FACTORS);
    const primaryCategory = getWeightedRandomCategory();
    const primaryProbability = Math.random() * 0.3 + 0.65; // 0.65 - 0.95

    const remainingProbability = 1 - primaryProbability;
    const secondaryCategories = categories.filter((c) => c !== primaryCategory);
    const secondaryCategory =
      secondaryCategories[Math.floor(Math.random() * secondaryCategories.length)];
    const secondaryProbability = remainingProbability * (0.3 + Math.random() * 0.4); // 30-70% of remaining

    const predictions = [
      { className: primaryCategory, probability: primaryProbability },
      { className: secondaryCategory, probability: secondaryProbability },
    ];

    // Add remaining categories with tiny probabilities
    const otherCategories = categories.filter(
      (c) => c !== primaryCategory && c !== secondaryCategory
    );
    const remainingPerCategory =
      (remainingProbability - secondaryProbability) / otherCategories.length;

    otherCategories.forEach((category) => {
      predictions.push({
        className: category,
        probability: Math.max(0.001, remainingPerCategory * (0.8 + Math.random() * 0.4)),
      });
    });

    // Sort by probability descending
    return predictions.sort((a, b) => b.probability - a.probability);
  }, [getWeightedRandomCategory]);

  /**
   * Classify an image element
   * @param {HTMLImageElement} imageElement - Image element to classify
   * @returns {Promise<Array>} - Array of prediction objects
   */
  const classifyImage = useCallback(
    async (imageElement) => {
      if (simulationMode || !modelRef.current) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));
        return generateFakePredictions();
      }

      try {
        const predictions = await modelRef.current.predict(imageElement);
        return predictions.map((p) => ({
          className: p.className,
          probability: p.probability,
        }));
      } catch (err) {
        console.error('Classification error:', err);
        // Fall back to simulation mode on error
        return generateFakePredictions();
      }
    },
    [simulationMode, generateFakePredictions]
  );

  return {
    model,
    isLoading,
    isReady,
    simulationMode,
    error,
    classifyImage,
  };
}

export default useModel;
