// Character sets for password generation
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '123456789',
  zero: '0',
  vowelsLower: 'aeiou',
  vowelsUpper: 'AEIOU',
  consonantsLower: 'bcdfghjklmnpqrstvwxyz',
  consonantsUpper: 'BCDFGHJKLMNPQRSTVWXYZ',
  consonantsLeftLower: 'qwrtsdfgyxcv',
  consonantsLeftUpper: 'QWRTSDFGYXCV',
  consonantsRightLower: 'zphjklbnm',
  consonantsRightUpper: 'ZPHJKLBNM',
  hexLower: '0123456789abcdef',
  hexUpper: '0123456789ABCDEF',
  simpleSpecial: '.:,;-_!?=()/+@',
};

const SIMILAR_CHARS = '1lIoO0';

// Cryptographically secure random function
function getSecureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function getRandomChar(chars: string): string {
  return chars[getSecureRandom(chars.length)];
}

function removeChars(source: string, toRemove: string): string {
  return source.split('').filter(char => !toRemove.includes(char)).join('');
}

function buildCharacterPool(config: any, excludeChars: string = '', excludeSimilar: boolean = false): string {
  let pool = '';
  
  if (config.uppercase) pool += CHAR_SETS.uppercase;
  if (config.lowercase) pool += CHAR_SETS.lowercase;
  if (config.digits) pool += CHAR_SETS.digits;
  if (config.zero) pool += CHAR_SETS.zero;
  if (config.special && config.specialChars) pool += config.specialChars;

  // Remove excluded characters
  if (excludeChars) pool = removeChars(pool, excludeChars);
  if (excludeSimilar) pool = removeChars(pool, SIMILAR_CHARS);

  return pool;
}

// Predefined password types
const PREDEFINED_TYPES = {
  internet1: { length: 8, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: false } },
  internet2: { length: 10, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: false } },
  internet3: { length: 14, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true, specialChars: '.:,;-_!?=()/+@' } },
  manager1: { length: 16, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true, specialChars: '.:,;-_!?=()/+@#$%&*<>[]{}' } },
  manager2: { length: 32, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true, specialChars: '.:,;-_!?=()/+@#$%&*<>[]{}' } },
  manager3: { length: 64, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true, specialChars: '.:,;-_!?=()/+@#$%&*<>[]{}' } },
  wep64: { length: 10, chars: { uppercase: false, lowercase: false, digits: true, zero: true, special: false }, hex: true },
  wep128: { length: 26, chars: { uppercase: false, lowercase: false, digits: true, zero: true, special: false }, hex: true },
  wep256: { length: 58, chars: { uppercase: false, lowercase: false, digits: true, zero: true, special: false }, hex: true },
  wpa2: { length: 63, chars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true, specialChars: '.:,;-_!?=()/+@' } },
};

export function generatePredefinedPasswords(config: any): string[] {
  const type = PREDEFINED_TYPES[config.type as keyof typeof PREDEFINED_TYPES];
  if (!type) throw new Error('Unbekannter Passwort-Typ');

  const passwords: string[] = [];
  
  for (let i = 0; i < config.count; i++) {
    let password = '';
    
    if (type.hex) {
      // Generate hexadecimal password
      const hexChars = CHAR_SETS.hexLower;
      for (let j = 0; j < type.length; j++) {
        password += getRandomChar(hexChars);
      }
    } else {
      // Generate regular password
      const pool = buildCharacterPool(
        type.chars,
        config.excludeSimilar ? SIMILAR_CHARS : '',
        config.excludeSimilar
      );
      
      if (!pool) throw new Error('Kein gültiger Zeichenpool verfügbar');
      
      for (let j = 0; j < type.length; j++) {
        let char;
        do {
          char = getRandomChar(pool);
        } while (config.avoidRepeating && j > 0 && char === password[j - 1]);
        
        password += char;
      }
    }
    
    passwords.push(password);
  }
  
  return passwords;
}

export function generateCustomPasswords(config: any): string[] {
  const passwords: string[] = [];
  
  for (let i = 0; i < config.count; i++) {
    let password = '';
    
    for (let pos = 0; pos < config.length; pos++) {
      let charConfig;
      
      if (pos === 0) {
        charConfig = { ...config.firstChar, specialChars: config.specialChars };
      } else if (pos === config.length - 1 && config.length > 1) {
        charConfig = { ...config.lastChar, specialChars: config.specialChars };
      } else {
        charConfig = { ...config.middleChars, specialChars: config.specialChars };
      }
      
      const pool = buildCharacterPool(charConfig, config.excludeChars);
      if (!pool) throw new Error('Kein gültiger Zeichenpool für Position ' + (pos + 1));
      
      let char;
      do {
        char = getRandomChar(pool);
      } while (config.avoidRepeating && pos > 0 && char === password[pos - 1]);
      
      password += char;
    }
    
    passwords.push(password);
  }
  
  return passwords;
}

export function generatePatternPasswords(config: any): string[] {
  const passwords: string[] = [];
  
  for (let i = 0; i < config.count; i++) {
    const password = generatePatternPassword(config.pattern, config.specialChars, config.excludeChars, config.avoidRepeating);
    passwords.push(password);
  }
  
  return passwords;
}

function generatePatternPassword(pattern: string, specialChars: string, excludeChars: string, avoidRepeating: boolean): string {
  const segments = pattern.split('|');
  let password = '';
  
  for (const segment of segments) {
    const chars = generateSegmentChars(segment.trim(), specialChars, excludeChars);
    
    for (const char of chars) {
      let selectedChar;
      do {
        selectedChar = char;
      } while (avoidRepeating && password.length > 0 && selectedChar === password[password.length - 1]);
      
      password += selectedChar;
    }
  }
  
  return password;
}

function generateSegmentChars(segment: string, specialChars: string, excludeChars: string): string[] {
  // Parse multiplier (e.g., "a*6" -> placeholder: "a", multiplier: 6)
  const multiplierMatch = segment.match(/^(.+?)\*(\d+)$/);
  let placeholder = segment;
  let multiplier = 1;
  
  if (multiplierMatch) {
    placeholder = multiplierMatch[1];
    multiplier = parseInt(multiplierMatch[2]);
  }
  
  // Build character pool for this placeholder
  let pool = '';
  
  for (const char of placeholder) {
    switch (char) {
      case 'a': pool += CHAR_SETS.lowercase; break;
      case 'A': pool += CHAR_SETS.uppercase; break;
      case 'n': pool += CHAR_SETS.digits; break;
      case 'N': pool += CHAR_SETS.zero; break;
      case 'v': pool += CHAR_SETS.vowelsLower; break;
      case 'V': pool += CHAR_SETS.vowelsUpper; break;
      case 'k': pool += CHAR_SETS.consonantsLower; break;
      case 'K': pool += CHAR_SETS.consonantsUpper; break;
      case 'l': pool += CHAR_SETS.consonantsLeftLower; break;
      case 'L': pool += CHAR_SETS.consonantsLeftUpper; break;
      case 'r': pool += CHAR_SETS.consonantsRightLower; break;
      case 'R': pool += CHAR_SETS.consonantsRightUpper; break;
      case 'h': pool += CHAR_SETS.hexLower; break;
      case 'H': pool += CHAR_SETS.hexUpper; break;
      case 's': pool += CHAR_SETS.simpleSpecial; break;
      case 'S': pool += specialChars; break;
    }
  }
  
  // Remove excluded characters
  if (excludeChars) {
    pool = removeChars(pool, excludeChars);
  }
  
  if (!pool) throw new Error(`Kein gültiger Zeichenpool für Segment: ${segment}`);
  
  // Generate characters
  const chars: string[] = [];
  for (let i = 0; i < multiplier; i++) {
    chars.push(getRandomChar(pool));
  }
  
  return chars;
}