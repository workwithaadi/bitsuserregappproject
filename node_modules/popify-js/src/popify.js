import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; // Ensure Toastify styles are included

/**
 * Popify - A wrapper around Toastify with custom defaults.
 */
class Popup {
  static defaultOptions = {
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      color: "#fff",
      borderRadius: "5px",
      padding: "10px",
    },
  };

  /**
   * Show a toast notification.
   * @param {string} message - The message to display.
   * @param {object} [options] - Custom options to override defaults.
   */
  static show(message, options = {}) {
    Toastify({
      text: message,
      ...this.defaultOptions,
      ...options,
    }).showToast();
  }

  /**
   * Show an error toast notification.
   * @param {string} message - The error message to display.
   */
  static error(message) {
    this.show(message, {
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    });
  }

  /**
   * Show a success toast notification.
   * @param {string} message - The success message to display.
   */
  static success(message) {
    this.show(message, {
      style: {
        background: "linear-gradient(to right, #4caf50, #8bc34a)",
      },
    });
  }
}

export default Popup;
