/**
 * Lua Obfuscator - Advanced Code Protection System
 * Supports multiple obfuscation techniques for maximum code protection
 */

class LuaObfuscator {
    constructor() {
        this.variableMap = new Map();
        this.functionMap = new Map();
        this.stringMap = new Map();
        this.numberMap = new Map();
        this.counter = 0;
        this.options = {};
    }

    /**
     * Main obfuscation entry point
     */
    obfuscate(code, options = {}) {
        try {
            this.options = {
                renameVariables: options.renameVariables !== false,
                removeComments: options.removeComments !== false,
                removeWhitespace: options.removeWhitespace !== false,
                stringEncryption: options.stringEncryption !== false,
                obfuscateNumbers: options.obfuscateNumbers !== false,
                antiDebug: options.antiDebug !== false,
                deadCode: options.deadCode !== false,
            };

            this.variableMap.clear();
            this.functionMap.clear();
            this.stringMap.clear();
            this.numberMap.clear();
            this.counter = 0;

            let result = code;

            // Phase 1: Remove comments
            if (this.options.removeComments) {
                result = this.removeComments(result);
            }

            // Phase 2: Process strings
            if (this.options.stringEncryption) {
                result = this.encryptStrings(result);
            }

            // Phase 3: Obfuscate numbers
            if (this.options.obfuscateNumbers) {
                result = this.obfuscateNumbers(result);
            }

            // Phase 4: Rename variables and functions
            if (this.options.renameVariables) {
                result = this.renameVariables(result);
            }

            // Phase 5: Remove whitespace
            if (this.options.removeWhitespace) {
                result = this.removeExcessWhitespace(result);
            }

            // Phase 6: Inject dead code
            if (this.options.deadCode) {
                result = this.injectDeadCode(result);
            }

            // Phase 7: Add anti-debug protection
            if (this.options.antiDebug) {
                result = this.addAntiDebugProtection(result);
            }

            return result;
        } catch (error) {
            throw new Error(`Obfuscation failed: ${error.message}`);
        }
    }

    /**
     * Remove comments from Lua code
     */
    removeComments(code) {
        // Remove single-line comments (-- comment)
        code = code.replace(/--\[\[[\s\S]*?\]\]/g, ''); // Block comments
        code = code.replace(/--[^\n]*/g, ''); // Single-line comments
        return code;
    }

    /**
     * Encrypt strings with various methods
     */
    encryptStrings(code) {
        let result = code;
        let stringPattern = /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g;
        
        result = result.replace(stringPattern, (match) => {
            const stringContent = match.slice(1, -1);
            const quote = match[0];

            // Skip if already processed
            if (this.stringMap.has(match)) {
                return this.stringMap.get(match);
            }

            let encrypted;
            const method = Math.floor(Math.random() * 3);

            switch (method) {
                case 0: // Hex encoding
                    encrypted = this.hexEncodeString(stringContent);
                    break;
                case 1: // Char encoding
                    encrypted = this.charEncodeString(stringContent);
                    break;
                case 2: // Base64 encoding
                    encrypted = this.base64EncodeString(stringContent);
                    break;
                default:
                    encrypted = match;
            }

            this.stringMap.set(match, encrypted);
            return encrypted;
        });

        return result;
    }

    /**
     * Hex encode string
     */
    hexEncodeString(str) {
        let result = '"';
        for (let i = 0; i < str.length; i++) {
            result += '\\x' + str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        result += '"';
        return result;
    }

    /**
     * Char encode string
     */
    charEncodeString(str) {
        const codes = [];
        for (let i = 0; i < str.length; i++) {
            codes.push(str.charCodeAt(i));
        }
        return `string.char(${codes.join(',')})`;
    }

    /**
     * Base64 encode string
     */
    base64EncodeString(str) {
        try {
            const encoded = btoa(str);
            return `loadstring(string.format([[%s]], [[local s='${encoded}' local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' local d = {} for i = 0, 63 do d[b:sub(i+1, i+1)] = i end local t = {} for i = 1, #s, 4 do local c1, c2, c3, c4 = d[s:sub(i, i)], d[s:sub(i+1, i+1)] or 0, d[s:sub(i+2, i+2)] or 0, d[s:sub(i+3, i+3)] or 0 t[#t+1] = string.char(bit.bor(bit.lshift(c1, 2), bit.rshift(c2, 4))) if i + 2 <= #s then t[#t+1] = string.char(bit.bor(bit.lshift(bit.band(c2, 15), 4), bit.rshift(c3, 2))) end if i + 3 <= #s then t[#t+1] = string.char(bit.bor(bit.lshift(bit.band(c3, 3), 6), c4)) end end return table.concat(t) ]]))()`;
        } catch (e) {
            return `string.char(${[...str].map(c => c.charCodeAt(0)).join(',')})`;
        }
    }

    /**
     * Obfuscate numeric literals
     */
    obfuscateNumbers(code) {
        // Match numeric literals
        let numberPattern = /\b(\d+(?:\.\d+)?)\b/g;
        
        let result = code.replace(numberPattern, (match) => {
            const num = parseFloat(match);
            
            if (this.numberMap.has(num)) {
                return this.numberMap.get(num);
            }

            // Generate obfuscated number expression
            const obfuscated = this.generateObfuscatedNumber(num);
            this.numberMap.set(num, obfuscated);
            return obfuscated;
        });

        return result;
    }

    /**
     * Generate obfuscated number expression
     */
    generateObfuscatedNumber(num) {
        const methods = [
            () => `(${Math.floor(num * 1000) / 1000})`,
            () => {
                const a = Math.floor(Math.random() * 100);
                const b = num + a;
                return `(${b}-${a})`;
            },
            () => {
                const a = Math.floor(Math.random() * 50);
                const b = num * (a + 1);
                return `(${b}/${a + 1})`;
            },
            () => `(0x${num.toString(16)})`
        ];

        return methods[Math.floor(Math.random() * methods.length)]();
    }

    /**
     * Rename variables and functions
     */
    renameVariables(code) {
        // Extract all identifiers
        const identifierPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        const luaKeywords = new Set([
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while', 'print', 'string',
            'table', 'math', 'tostring', 'tonumber', 'ipairs', 'pairs',
            'type', 'require', 'os', 'io', 'bit', 'assert'
        ]);

        let result = code;
        const identifiers = new Set();
        let match;

        while ((match = identifierPattern.exec(code)) !== null) {
            const identifier = match[1];
            if (!luaKeywords.has(identifier)) {
                identifiers.add(identifier);
            }
        }

        // Rename each identifier
        identifiers.forEach(identifier => {
            const newName = this.generateObfuscatedName();
            const regex = new RegExp(`\\b${identifier}\\b`, 'g');
            result = result.replace(regex, newName);
            this.variableMap.set(identifier, newName);
        });

        return result;
    }

    /**
     * Generate obfuscated name for variables
     */
    generateObfuscatedName() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        let name = '';
        
        // Generate name starting with letter or underscore
        name += chars[Math.floor(Math.random() * (chars.length - 1))];
        
        // Add random characters and numbers
        for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return name + this.counter++;
    }

    /**
     * Remove excess whitespace
     */
    removeExcessWhitespace(code) {
        // Remove leading/trailing whitespace
        code = code.trim();
        
        // Replace multiple spaces with single space (but preserve strings)
        code = code.replace(/([^'\"])\s+/g, '$1 ');
        
        // Remove whitespace around operators
        code = code.replace(/\s*([=+\-*/%<>!~&|()])\s*/g, '$1');
        
        // Remove newlines (except in strings)
        let result = '';
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prevChar = i > 0 ? code[i - 1] : '';
            
            if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
                result += char;
            } else if (char === '\n' && !inString) {
                // Skip newlines outside strings
                continue;
            } else {
                result += char;
            }
        }
        
        return result;
    }

    /**
     * Inject dead code to confuse decompilers
     */
    injectDeadCode(code) {
        const deadCodeSnippets = [
            'local _=_ or 0;',
            'local __=function()end;',
            'local ___={};',
            'if false then local x=1 end;',
            'local a,b,c=1,2,3;',
            'local function _dead()return end;',
            'local t={1,2,3,4,5};for i,v in ipairs(t)do end;',
            'local s="";for i=1,10 do s=s..i end;',
        ];

        // Randomly insert dead code
        let result = code;
        const lines = code.split(';');
        
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
            const randomIndex = Math.floor(Math.random() * lines.length);
            const deadCode = deadCodeSnippets[Math.floor(Math.random() * deadCodeSnippets.length)];
            lines.splice(randomIndex, 0, deadCode);
        }

        result = lines.join(';');
        return result;
    }

    /**
     * Add anti-debug protection
     */
    addAntiDebugProtection(code) {
        const antiDebugCode = `
local _G_checks=0;
local function _anti_debug()
    _G_checks=_G_checks+1;
    if _G_checks>1000 then
        local t=debug.getinfo;
        if t then
            error("Debug detected!");
        end
    end
end
${code}
_anti_debug();
        `.trim();

        return antiDebugCode;
    }

    /**
     * Get obfuscation statistics
     */
    getStats(original, obfuscated) {
        const inputSize = new Blob([original]).size;
        const outputSize = new Blob([obfuscated]).size;
        const reduction = Math.round(((inputSize - outputSize) / inputSize) * 100);
        
        return {
            inputSize,
            outputSize,
            reduction: Math.max(0, reduction),
            obfuscationLevel: this.calculateObfuscationLevel()
        };
    }

    /**
     * Calculate obfuscation level
     */
    calculateObfuscationLevel() {
        let level = 0;
        if (this.options.renameVariables) level += 20;
        if (this.options.removeComments) level += 15;
        if (this.options.stringEncryption) level += 25;
        if (this.options.obfuscateNumbers) level += 15;
        if (this.options.antiDebug) level += 15;
        if (this.options.deadCode) level += 10;

        if (level >= 90) return 'Extreme';
        if (level >= 70) return 'Very High';
        if (level >= 50) return 'High';
        if (level >= 30) return 'Medium';
        return 'Low';
    }
}

// Global instance
const obfuscator = new LuaObfuscator();

/**
 * Main obfuscation function called from UI
 */
function obfuscateCode() {
    const inputCode = document.getElementById('inputCode').value;
    const obfuscateBtn = document.getElementById('obfuscateBtn');

    if (!inputCode.trim()) {
        showMessage('Please paste some Lua code to obfuscate.', 'error');
        return;
    }

    try {
        obfuscateBtn.disabled = true;
        obfuscateBtn.innerHTML = '<span class="loading"></span> Processing...';

        // Get options
        const options = {
            renameVariables: document.getElementById('renameVariables').checked,
            removeComments: document.getElementById('removeComments').checked,
            removeWhitespace: document.getElementById('removeWhitespace').checked,
            stringEncryption: document.getElementById('stringEncryption').checked,
            obfuscateNumbers: document.getElementById('obfuscateNumbers').checked,
            antiDebug: document.getElementById('antiDebug').checked,
            deadCode: document.getElementById('deadCode').checked,
        };

        // Simulate processing delay for UI feedback
        setTimeout(() => {
            const obfuscatedCode = obfuscator.obfuscate(inputCode, options);
            document.getElementById('outputCode').value = obfuscatedCode;

            // Calculate and display stats
            const stats = obfuscator.getStats(inputCode, obfuscatedCode);
            displayStats(stats);

            // Enable output buttons
            document.getElementById('copyBtn').disabled = false;
            document.getElementById('downloadBtn').disabled = false;

            showMessage('✓ Code obfuscated successfully!', 'success');
            obfuscateBtn.disabled = false;
            obfuscateBtn.innerHTML = '<span>⚡</span> Obfuscate';
        }, 500);

    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
        obfuscateBtn.disabled = false;
        obfuscateBtn.innerHTML = '<span>⚡</span> Obfuscate';
    }
}

/**
 * Display statistics
 */
function displayStats(stats) {
    document.getElementById('statsContainer').style.display = 'grid';
    document.getElementById('inputSize').textContent = stats.inputSize;
    document.getElementById('outputSize').textContent = stats.outputSize;
    document.getElementById('reduction').textContent = stats.reduction + '%';
    document.getElementById('obfuscationLevel').textContent = stats.obfuscationLevel;
}

/**
 * Copy to clipboard
 */
function copyToClipboard() {
    const outputCode = document.getElementById('outputCode');
    outputCode.select();
    document.execCommand('copy');
    showMessage('✓ Copied to clipboard!', 'success');
}

/**
 * Download code
 */
function downloadCode() {
    const outputCode = document.getElementById('outputCode').value;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputCode));
    element.setAttribute('download', 'obfuscated.lua');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showMessage('✓ File downloaded!', 'success');
}

/**
 * Clear all
 */
function clearAll() {
    document.getElementById('inputCode').value = '';
    document.getElementById('outputCode').value = '';
    document.getElementById('statsContainer').style.display = 'none';
    document.getElementById('copyBtn').disabled = true;
    document.getElementById('downloadBtn').disabled = true;
    showMessage('Cleared all fields', 'info');
}

/**
 * Show message
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('statusMessage');
    messageDiv.textContent = message;
    messageDiv.className = `status-message ${type}`;
    messageDiv.style.display = 'flex';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 4000);
}
