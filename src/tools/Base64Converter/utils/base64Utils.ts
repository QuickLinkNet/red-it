interface ConversionResult {
  success: boolean;
  result?: string;
  error?: string;
  operation: 'encode' | 'decode';
}

export function encodeBase64(input: string): ConversionResult {
  try {
    if (!input.trim()) {
      return {
        success: false,
        error: 'Bitte geben Sie Text zum Kodieren ein',
        operation: 'encode'
      };
    }

    // Use btoa for basic ASCII strings, but handle Unicode properly
    const encoded = btoa(unescape(encodeURIComponent(input)));
    
    return {
      success: true,
      result: encoded,
      operation: 'encode'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Kodierungsfehler',
      operation: 'encode'
    };
  }
}

export function decodeBase64(input: string): ConversionResult {
  try {
    if (!input.trim()) {
      return {
        success: false,
        error: 'Bitte geben Sie einen Base64-String zum Dekodieren ein',
        operation: 'decode'
      };
    }

    // Remove whitespace and validate Base64 format
    const cleanInput = input.replace(/\s/g, '');
    
    // Basic Base64 validation
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanInput)) {
      return {
        success: false,
        error: 'Ungültiges Base64-Format. Erlaubte Zeichen: A-Z, a-z, 0-9, +, /, =',
        operation: 'decode'
      };
    }

    // Check if length is valid (must be multiple of 4)
    if (cleanInput.length % 4 !== 0) {
      return {
        success: false,
        error: 'Ungültige Base64-Länge. Die Länge muss ein Vielfaches von 4 sein.',
        operation: 'decode'
      };
    }

    // Decode and handle Unicode properly
    const decoded = decodeURIComponent(escape(atob(cleanInput)));
    
    return {
      success: true,
      result: decoded,
      operation: 'decode'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ungültiger Base64-String oder Dekodierungsfehler',
      operation: 'decode'
    };
  }
}

export function isValidBase64(str: string): boolean {
  try {
    const cleanStr = str.replace(/\s/g, '');
    return /^[A-Za-z0-9+/]*={0,2}$/.test(cleanStr) && cleanStr.length % 4 === 0;
  } catch {
    return false;
  }
}

export function detectInputType(input: string): 'text' | 'base64' | 'unknown' {
  if (!input.trim()) return 'unknown';
  
  const cleanInput = input.replace(/\s/g, '');
  
  // If it looks like Base64 and is valid, suggest it's Base64
  if (isValidBase64(cleanInput) && cleanInput.length > 4) {
    return 'base64';
  }
  
  // Otherwise assume it's regular text
  return 'text';
}