"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = exports.emailRegex = void 0;
exports.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_])[A-Za-z\d@$!%*?&.#_]{8,}$/;
