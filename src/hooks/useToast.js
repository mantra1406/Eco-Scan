import { useState, useCallback, useRef } from 'react';

/**
 * Toast item type
 * @typedef {Object} Toast
 * @property {string} id - Unique identifier
 * @property {string} message - Toast message
 * @property {'success'|'error'|'warning'|'info'} type - Toast type
 * @property {number} duration - Duration in milliseconds
 */

/**
 * Custom hook for managing toast notifications
 * @returns {Object} - Toast management functions and state
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  /**
   * Add a new toast
   * @param {string} message - Toast message
   * @param {'success'|'error'|'warning'|'info'} type - Toast type
   * @param {number} duration - Duration in milliseconds (default: 3000)
   * @returns {string} - Toast ID
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `toast-${++toastIdRef.current}`;
    
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Remove a toast by ID
   * @param {string} id - Toast ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Remove all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Shorthand for showing success toast
   * @param {string} message - Toast message
   * @param {number} duration - Duration in milliseconds
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  /**
   * Shorthand for showing error toast
   * @param {string} message - Toast message
   * @param {number} duration - Duration in milliseconds
   */
  const showError = useCallback((message, duration = 4000) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  /**
   * Shorthand for showing warning toast
   * @param {string} message - Toast message
   * @param {number} duration - Duration in milliseconds
   */
  const showWarning = useCallback((message, duration = 3500) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  /**
   * Shorthand for showing info toast
   * @param {string} message - Toast message
   * @param {number} duration - Duration in milliseconds
   */
  const showInfo = useCallback((message, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

export default useToast;
