/**
 * Complete Advanced Obfuscator - Java-inspired with Full Protection System
 * Implements all techniques from the Java version
 */

class CompleteObfuscator {
    constructor() {
        // Base64-like character mapping (similar to Java version)
        this.CIPHER_MAP = new Map();
        this.initializeCipherMap();
        this.stringCache = new Map();
        this.numberCache = new Map();
        this.counter = 0;
    }

    /**
     * Initialize cipher map for string encoding/decoding
     */
    initializeCipherMap() {
        // Base64 extended charset
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for (let i = 0; i < charset.length; i++) {
            this.CIPHER_MAP.set(charset[i], i);
        }
    }

    /**
     * Encode string similar to Java dBL function
     */
    encodeStringToBase64(str) {
        try {
            return btoa(str);
        } catch (e) {
            return str;
        }
    }

    /**
     * Decode Base64 similar to Java dBL function
     */
    decodeStringFromBase64(encoded) {
        try {
            let result = '';
            let v = 0, b = 0;

            for (let i = 0; i < encoded.length; i++) {
                const c = encoded[i];
                const m = this.CIPHER_MAP.get(c);

                if (m !== undefined) {
                    v = (v << 6) | m;
                    b += 6;
                    if (b >= 8) {
                        b -= 8;
                        result += String.fromCharCode((v >> b) & 0xFF);
                    }
                } else if (c === '=') {
                    break;
                }
            }
            return result;
        } catch (e) {
            return encoded;
        }
    }

    /**
     * Full code obfuscation with all Java techniques
     */
    obfuscate(code, options = {}) {
        try {
            const opts = {
                renameVariables: options.renameVariables !== false,
                removeComments: options.removeComments !== false,
                removeWhitespace: options.removeWhitespace !== false,
                stringEncryption: options.stringEncryption !== false,
                obfuscateNumbers: options.obfuscateNumbers !== false,
                antiDebug: options.antiDebug !== false,
                antiTamper: options.antiTamper !== false,
                deadCode: options.deadCode !== false,
                arithmeticChains: options.arithmeticChains !== false,
                controlFlowObfuscation: options.controlFlowObfuscation !== false,
            };

            let result = code;

            // Phase 1: Remove comments
            if (opts.removeComments) {
                result = this.removeAllComments(result);
            }

            // Phase 2: String extraction and encryption
            if (opts.stringEncryption) {
                result = this.extractAndEncryptStrings(result);
            }

            // Phase 3: Arithmetic expression obfuscation
            if (opts.arithmeticChains) {
                result = this.obfuscateArithmeticExpressions(result);
            }

            // Phase 4: Number obfuscation
            if (opts.obfuscateNumbers) {
                result = this.obfuscateNumericLiterals(result);
            }

            // Phase 5: Variable and function renaming
            if (opts.renameVariables) {
                result = this.renameAllIdentifiers(result);
            }

            // Phase 6: Control flow obfuscation
            if (opts.controlFlowObfuscation) {
                result = this.obfuscateControlFlow(result);
            }

            // Phase 7: Whitespace removal
            if (opts.removeWhitespace) {
                result = this.removeExcessWhitespace(result);
            }

            // Phase 8: Add dead code
            if (opts.deadCode) {
                result = this.injectComplexDeadCode(result);
            }

            // Phase 9: Anti-debug protection
            if (opts.antiDebug) {
                result = this.addAntiDebugProtection(result);
            }

            // Phase 10: Anti-tamper protection
            if (opts.antiTamper) {
                result = this.addAntiTamperProtection(result);
            }

            return result;
        } catch (error) {
            Logger.error(`Obfuscation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove all types of comments
     */
    removeAllComments(code) {
        // Remove block comments --[[ ]]
        code = code.replace(/--\[\[[\s\S]*?\]\]/g, '');
        // Remove single-line comments
        code = code.replace(/--[^\n]*/g, '');
        return code;
    }

    /**
     * Extract and encrypt strings with multiple methods
     */
    extractAndEncryptStrings(code) {
        const stringPattern = /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g;
        const stringReplacements = new Map();
        let stringIndex = 0;

        code = code.replace(stringPattern, (match) => {
            const stringContent = match.slice(1, -1);
            const stringId = `__STR_${stringIndex++}__`;

            // Apply different encryption methods
            const encryptionMethod = stringIndex % 4;
            let encrypted;

            switch (encryptionMethod) {
                case 0:
                    // Hex encoding
                    encrypted = this.hexEncodeString(stringContent);
                    break;
                case 1:
                    // Char array
                    encrypted = this.charArrayEncoding(stringContent);
                    break;
                case 2:
                    // Base64
                    encrypted = this.base64EncodeString(stringContent);
                    break;
                case 3:
                    // XOR encryption
                    encrypted = this.xorEncodeString(stringContent);
                    break;
            }

            stringReplacements.set(stringId, encrypted);
            this.stringCache.set(stringId, stringContent);
            return stringId;
        });

        // Add string decoder function
        const decoderFunction = this.generateStringDecoderFunction(stringReplacements);
        return decoderFunction + '\n' + code;
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
     * Char array encoding
     */
    charArrayEncoding(str) {
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
            return `"${encoded}"`;
        } catch (e) {
            return `string.char(${[...str].map(c => c.charCodeAt(0)).join(',')})`;
        }
    }

    /**
     * XOR encode string
     */
    xorEncodeString(str, key = 0x2A) {
        let result = [];
        for (let i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i) ^ key);
        }
        return `"${result.map(c => '\\x' + c.toString(16).padStart(2, '0')).join('')}"`;
    }

    /**
     * Generate string decoder function
     */
    generateStringDecoderFunction(stringReplacements) {
        let decoderCode = 'local __STRINGS = {};\n';

        for (const [id, encrypted] of stringReplacements) {
            decoderCode += `__STRINGS["${id}"] = ${encrypted};\n`;
        }

        decoderCode += `
local function __GET_STRING(id)
    return __STRINGS[id] or ""
end
        `.trim();

        return decoderCode;
    }

    /**
     * Obfuscate arithmetic expressions
     */
    obfuscateArithmeticExpressions(code) {
        // This regex finds arithmetic patterns
        const patterns = [
            { regex: /(\d+)\s*\+\s*(\d+)/g, handler: (m1, m2) => this.obfuscateAddition(m1, m2) },
            { regex: /(\d+)\s*-\s*(\d+)/g, handler: (m1, m2) => this.obfuscateSubtraction(m1, m2) },
            { regex: /(\d+)\s*\*\s*(\d+)/g, handler: (m1, m2) => this.obfuscateMultiplication(m1, m2) },
            { regex: /(\d+)\s*\/\s*(\d+)/g, handler: (m1, m2) => this.obfuscateDivision(m1, m2) },
        ];

        let result = code;
        for (const { regex, handler } of patterns) {
            result = result.replace(regex, (match, m1, m2) => `(${handler(m1, m2)})`);
        }

        return result;
    }

    /**
     * Obfuscate addition
     */
    obfuscateAddition(a, b) {
        const sum = parseInt(a) + parseInt(b);
        const methods = [
            `${sum}`,
            `${sum + 100}-100`,
            `${sum - 50}+50`,
            `${sum * 2}/2`,
            `${Math.floor(sum / 2)}+${Math.ceil(sum / 2)}`,
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    /**
     * Obfuscate subtraction
     */
    obfuscateSubtraction(a, b) {
        const result = parseInt(a) - parseInt(b);
        const methods = [
            `${result}`,
            `${result + 50}-50`,
            `${parseInt(a)}-${parseInt(b)}`,
            `${result * 2}/2`,
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    /**
     * Obfuscate multiplication
     */
    obfuscateMultiplication(a, b) {
        const result = parseInt(a) * parseInt(b);
        return `${result}`;
    }

    /**
     * Obfuscate division
     */
    obfuscateDivision(a, b) {
        const result = parseInt(a) / parseInt(b);
        return `${result}`;
    }

    /**
     * Obfuscate numeric literals
     */
    obfuscateNumericLiterals(code) {
        const numberPattern = /\b(\d+(?:\.\d+)?)\b/g;

        return code.replace(numberPattern, (match) => {
            const num = parseFloat(match);

            if (this.numberCache.has(num)) {
                return this.numberCache.get(num);
            }

            const obfuscated = this.generateComplexNumber(num);
            this.numberCache.set(num, obfuscated);
            return obfuscated;
        });
    }

    /**
     * Generate complex number representation
     */
    generateComplexNumber(num) {
        const methods = [
            `(${num})`,
            `(${num + Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)})`,
            `(${num * Math.floor(Math.random() * 10)})/${Math.floor(Math.random() * 10)}`,
            `(0x${Math.floor(num).toString(16)})`,
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    /**
     * Rename all identifiers
     */
    renameAllIdentifiers(code) {
        const luaKeywords = new Set([
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while', 'print', 'string',
            'table', 'math', 'tostring', 'tonumber', 'ipairs', 'pairs',
            'type', 'require', 'os', 'io', 'bit', 'assert', 'debug'
        ]);

        const identifierPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        const identifierMap = new Map();

        let match;
        const identifiers = new Set();

        while ((match = identifierPattern.exec(code)) !== null) {
            const identifier = match[1];
            if (!luaKeywords.has(identifier) && !identifier.startsWith('__')) {
                identifiers.add(identifier);
            }
        }

        identifiers.forEach(identifier => {
            const newName = this.generateObfuscatedIdentifier();
            identifierMap.set(identifier, newName);
        });

        let result = code;
        identifierMap.forEach((newName, identifier) => {
            const regex = new RegExp(`\\b${identifier}\\b`, 'g');
            result = result.replace(regex, newName);
        });

        return result;
    }

    /**
     * Generate obfuscated identifier
     */
    generateObfuscatedIdentifier() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        let name = chars[Math.floor(Math.random() * (chars.length - 1))];

        for (let i = 0; i < Math.floor(Math.random() * 8) + 3; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }

        return name + '_' + this.counter++;
    }

    /**
     * Obfuscate control flow
     */
    obfuscateControlFlow(code) {
        // Replace if/else with and/or equivalents
        let result = code;

        // Simple control flow transformation
        result = result.replace(/if\s+(.+?)\s+then\s+(.+?)\s+end/g, (match, condition, body) => {
            return `(${condition}) and (${body}) or nil`;
        });

        return result;
    }

    /**
     * Remove excess whitespace
     */
    removeExcessWhitespace(code) {
        code = code.trim();
        code = code.replace(/\n\s*\n/g, '\n');
        code = code.replace(/\s+/g, ' ');
        code = code.replace(/\s*([=+\-*/%<>(){}[\],:;])\s*/g, '$1');
        return code;
    }

    /**
     * Inject complex dead code
     */
    injectComplexDeadCode(code) {
        const deadCodeSnippets = [
            `local __l=${Math.random()};local __v=function()return __l end;__v();`,
            `local __a,__b,__c=${Math.random()},${Math.random()},${Math.random()};`,
            `local __t={${Math.random()},${Math.random()},${Math.random()}};for __i,__v in ipairs(__t)do end;`,
            `if false then local __x=${Math.random()} end;`,
            `local __s="";for __i=1,${Math.floor(Math.random()*10)+1} do __s=__s..__i end;`,
            `local __r=math.random(${Math.floor(Math.random()*1000)+1});`,
            `local function __dead()return ${Math.random()}end;__dead();`,
            `local __m=setmetatable({},{__index=function()return ${Math.random()}end});`,
        ];

        const lines = code.split('\n');
        const insertCount = Math.min(Math.floor(lines.length / 4), 10);

        for (let i = 0; i < insertCount; i++) {
            const insertIndex = Math.floor(Math.random() * lines.length);
            const deadCode = deadCodeSnippets[Math.floor(Math.random() * deadCodeSnippets.length)];
            lines.splice(insertIndex, 0, deadCode);
        }

        return lines.join('\n');
    }

    /**
     * Add anti-debug protection
     */
    addAntiDebugProtection(code) {
        const antiDebugCode = `
local __DEBUG_CHECK=0;
local function __ANTI_DEBUG()
    __DEBUG_CHECK=__DEBUG_CHECK+1;
    if __DEBUG_CHECK>1000 then
        if debug and debug.getinfo then
            local __info=debug.getinfo;
            if __info then
                error("\\n========================================\\n⛔ ANTI-DEBUG PROTECTION ACTIVATED\\n========================================\\nDebug environment detected!\\n========================================\\n");
            end
        end
    end
end

-- Main code
${code}

__ANTI_DEBUG();
        `.trim();

        return antiDebugCode;
    }

    /**
     * Add anti-tamper protection
     */
    addAntiTamperProtection(code) {
        const antiTamperCode = `
local __ORIG_HASH="${this.hashCode(code)}";
local __EXEC_COUNT=0;
local __START_TIME=os.time();

local function __VERIFY_INTEGRITY()
    __EXEC_COUNT=__EXEC_COUNT+1;
    local __CURRENT_TIME=os.time();
    local __ELAPSED=__CURRENT_TIME-__START_TIME;
    
    if __ELAPSED>30 then
        error("\\n========================================\\n⛔ ANTI-TAMPER SYSTEM ACTIVATED\\n========================================\\nCode tampering suspected!\\nExecution time anomaly detected.\\n========================================\\n");
    end
    
    if __EXEC_COUNT%500==0 then
        if debug then
            local __info=debug.getinfo;
            if __info then
                error("\\n========================================\\n⛔ ANTI-TAMPER SYSTEM ACTIVATED\\n========================================\\nDebug interface detected!\\n========================================\\n");
            end
        end
    end
end

${code}

__VERIFY_INTEGRITY();
        `.trim();

        return antiTamperCode;
    }

    /**
     * Simple hash function for code
     */
    hashCode(code) {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Get detailed statistics
     */
    getStats(original, obfuscated) {
        const originalSize = new Blob([original]).size;
        const obfuscatedSize = new Blob([obfuscated]).size;
        const reduction = Math.round(((originalSize - obfuscatedSize) / originalSize) * 100);

        return {
            inputSize: originalSize,
            outputSize: obfuscatedSize,
            reduction: Math.max(0, reduction),
            stringsCached: this.stringCache.size,
            numbersCached: this.numberCache.size,
            identifiersRenamed: this.counter,
            obfuscationLevel: this.calculateLevel(),
        };
    }

    /**
     * Calculate obfuscation level
     */
    calculateLevel() {
        const score = this.stringCache.size + this.numberCache.size + this.counter;
        if (score > 500) return 'Extreme';
        if (score > 250) return 'Very High';
        if (score > 100) return 'High';
        if (score > 50) return 'Medium';
        return 'Low';
    }
}

// Export
window.CompleteObfuscator = CompleteObfuscator;
