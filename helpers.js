/**
 * Helper Functions for Lua Obfuscator
 * Provides utility functions to improve obfuscation quality and error handling
 */

/**
 * Advanced String Pattern Matcher for Lua
 */
class LuaLexer {
    constructor(code) {
        this.code = code;
        this.position = 0;
        this.tokens = [];
    }

    /**
     * Tokenize Lua code
     */
    tokenize() {
        const tokens = [];
        this.position = 0;

        while (this.position < this.code.length) {
            const char = this.code[this.position];

            // Skip whitespace
            if (/\s/.test(char)) {
                this.position++;
                continue;
            }

            // Comments
            if (char === '-' && this.code[this.position + 1] === '-') {
                this.skipComment();
                continue;
            }

            // Block comments
            if (char === '-' && this.code.substr(this.position, 4) === '--[[') {
                this.skipBlockComment();
                continue;
            }

            // Strings
            if (char === '"' || char === "'" || char === '`') {
                tokens.push(this.readString());
                continue;
            }

            // Block strings
            if (this.code.substr(this.position, 2) === '[[') {
                tokens.push(this.readBlockString());
                continue;
            }

            // Numbers
            if (/\d/.test(char) || (char === '.' && /\d/.test(this.code[this.position + 1]))) {
                tokens.push(this.readNumber());
                continue;
            }

            // Identifiers and keywords
            if (/[a-zA-Z_]/.test(char)) {
                tokens.push(this.readIdentifier());
                continue;
            }

            // Operators and punctuation
            tokens.push({
                type: 'operator',
                value: char
            });
            this.position++;
        }

        return tokens;
    }

    /**
     * Skip single-line comment
     */
    skipComment() {
        while (this.position < this.code.length && this.code[this.position] !== '\n') {
            this.position++;
        }
    }

    /**
     * Skip block comment
     */
    skipBlockComment() {
        this.position += 4;
        while (this.position < this.code.length - 1) {
            if (this.code.substr(this.position, 2) === ']]') {
                this.position += 2;
                break;
            }
            this.position++;
        }
    }

    /**
     * Read string
     */
    readString() {
        const quote = this.code[this.position];
        let value = quote;
        this.position++;

        while (this.position < this.code.length) {
            const char = this.code[this.position];

            if (char === '\\') {
                value += char + this.code[this.position + 1];
                this.position += 2;
            } else if (char === quote) {
                value += char;
                this.position++;
                break;
            } else {
                value += char;
                this.position++;
            }
        }

        return { type: 'string', value };
    }

    /**
     * Read block string
     */
    readBlockString() {
        let value = '[[';
        this.position += 2;

        while (this.position < this.code.length - 1) {
            if (this.code.substr(this.position, 2) === ']]') {
                value += ']]';
                this.position += 2;
                break;
            }
            value += this.code[this.position];
            this.position++;
        }

        return { type: 'string', value };
    }

    /**
     * Read number
     */
    readNumber() {
        let value = '';

        // Hex number
        if (this.code.substr(this.position, 2) === '0x') {
            value += '0x';
            this.position += 2;
            while (this.position < this.code.length && /[0-9a-fA-F]/.test(this.code[this.position])) {
                value += this.code[this.position];
                this.position++;
            }
        } else {
            // Decimal number
            while (this.position < this.code.length && /[\d.]/.test(this.code[this.position])) {
                value += this.code[this.position];
                this.position++;
            }

            // Scientific notation
            if (this.code[this.position] === 'e' || this.code[this.position] === 'E') {
                value += this.code[this.position];
                this.position++;
                if (this.code[this.position] === '+' || this.code[this.position] === '-') {
                    value += this.code[this.position];
                    this.position++;
                }
                while (this.position < this.code.length && /\d/.test(this.code[this.position])) {
                    value += this.code[this.position];
                    this.position++;
                }
            }
        }

        return { type: 'number', value };
    }

    /**
     * Read identifier or keyword
     */
    readIdentifier() {
        let value = '';
        while (this.position < this.code.length && /[a-zA-Z0-9_]/.test(this.code[this.position])) {
            value += this.code[this.position];
            this.position++;
        }

        const keywords = [
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while'
        ];

        const type = keywords.includes(value) ? 'keyword' : 'identifier';
        return { type, value };
    }
}

/**
 * Advanced String Encryption
 */
class StringEncryptor {
    /**
     * XOR encryption
     */
    static xorEncrypt(str, key = 42) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key);
        }
        return btoa(result); // Base64 encode
    }

    /**
     * Caesar cipher
     */
    static caesarEncrypt(str, shift = 13) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const code = char.charCodeAt(0);
            result += String.fromCharCode(code + shift);
        }
        return result;
    }

    /**
     * Convert string to octal
     */
    static octalEncrypt(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += '\\' + str.charCodeAt(i).toString(8);
        }
        return `"${result}"`;
    }

    /**
     * Convert string to decimal
     */
    static decimalEncrypt(str) {
        const codes = [];
        for (let i = 0; i < str.length; i++) {
            codes.push(str.charCodeAt(i));
        }
        return `string.char(${codes.join(',')})`;
    }
}

/**
 * Code Analyzer for better obfuscation
 */
class CodeAnalyzer {
    /**
     * Find all local variables
     */
    static findLocalVariables(code) {
        const pattern = /local\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const variables = new Set();
        let match;

        while ((match = pattern.exec(code)) !== null) {
            variables.add(match[1]);
        }

        return Array.from(variables);
    }

    /**
     * Find all functions
     */
    static findFunctions(code) {
        const pattern = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const functions = new Set();
        let match;

        while ((match = pattern.exec(code)) !== null) {
            functions.add(match[1]);
        }

        return Array.from(functions);
    }

    /**
     * Find all string literals
     */
    static findStrings(code) {
        const pattern = /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g;
        const strings = [];
        let match;

        while ((match = pattern.exec(code)) !== null) {
            strings.push(match[0]);
        }

        return strings;
    }

    /**
     * Find all numeric literals
     */
    static findNumbers(code) {
        const pattern = /\b(\d+(?:\.\d+)?)\b/g;
        const numbers = new Set();
        let match;

        while ((match = pattern.exec(code)) !== null) {
            numbers.add(match[1]);
        }

        return Array.from(numbers);
    }

    /**
     * Calculate code complexity
     */
    static analyzeComplexity(code) {
        const lines = code.split('\n').length;
        const chars = code.length;
        const variables = this.findLocalVariables(code).length;
        const functions = this.findFunctions(code).length;

        return {
            lines,
            chars,
            variables,
            functions,
            complexity: Math.round((variables + functions) / (lines || 1) * 100) / 100
        };
    }
}

/**
 * Error Handler and Validator
 */
class ErrorHandler {
    /**
     * Validate Lua syntax
     */
    static validateSyntax(code) {
        const errors = [];

        // Check for unmatched brackets
        let braces = 0, brackets = 0, parens = 0;
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prevChar = i > 0 ? code[i - 1] : '';

            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }

            if (!inString) {
                if (char === '{') braces++;
                if (char === '}') braces--;
                if (char === '[') brackets++;
                if (char === ']') brackets--;
                if (char === '(') parens++;
                if (char === ')') parens--;
            }
        }

        if (braces !== 0) errors.push('Unmatched braces { }');
        if (brackets !== 0) errors.push('Unmatched brackets [ ]');
        if (parens !== 0) errors.push('Unmatched parentheses ( )');

        return { valid: errors.length === 0, errors };
    }

    /**
     * Check for reserved words in variable names
     */
    static checkReservedWords(variables) {
        const reserved = [
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while'
        ];

        const conflicts = variables.filter(v => reserved.includes(v));
        return conflicts;
    }

    /**
     * Sanitize variable name
     */
    static sanitizeVariableName(name) {
        // Remove special characters, keep only alphanumeric and underscore
        return name.replace(/[^a-zA-Z0-9_]/g, '_');
    }
}

/**
 * Performance Optimizer
 */
class PerformanceOptimizer {
    /**
     * Remove unused variables (safe removal)
     */
    static removeUnusedVariables(code) {
        const analyzer = CodeAnalyzer;
        const variables = analyzer.findLocalVariables(code);
        let result = code;

        variables.forEach(variable => {
            const pattern = new RegExp(`\\b${variable}\\b`, 'g');
            const matches = (code.match(pattern) || []).length;

            // If variable is declared but only used once (declaration), remove it
            if (matches === 1) {
                const declarationPattern = new RegExp(`local\\s+${variable}\\s*=\\s*[^;\\n]+[;\\n]`, 'g');
                result = result.replace(declarationPattern, '');
            }
        });

        return result;
    }

    /**
     * Inline small functions
     */
    static inlineSmallFunctions(code) {
        // This is a simplified version - full implementation would be more complex
        return code;
    }

    /**
     * Fold constants
     */
    static foldConstants(code) {
        // Replace constant expressions with their values
        const pattern = /local\s+(\w+)\s*=\s*(\d+)\s*[\+\-\*\/]\s*(\d+)/g;
        
        return code.replace(pattern, (match, varName, num1, op, num2) => {
            let result;
            switch (op) {
                case '+': result = parseInt(num1) + parseInt(num2); break;
                case '-': result = parseInt(num1) - parseInt(num2); break;
                case '*': result = parseInt(num1) * parseInt(num2); break;
                case '/': result = parseInt(num1) / parseInt(num2); break;
                default: return match;
            }
            return `local ${varName} = ${result}`;
        });
    }
}

/**
 * Log utility for debugging
 */
class Logger {
    static logs = [];

    static log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }

    static error(message) {
        this.log(message, 'error');
    }

    static warn(message) {
        this.log(message, 'warn');
    }

    static info(message) {
        this.log(message, 'info');
    }

    static getLogs() {
        return this.logs;
    }

    static clearLogs() {
        this.logs = [];
    }
}

// Export for use
window.LuaLexer = LuaLexer;
window.StringEncryptor = StringEncryptor;
window.CodeAnalyzer = CodeAnalyzer;
window.ErrorHandler = ErrorHandler;
window.PerformanceOptimizer = PerformanceOptimizer;
window.Logger = Logger;
