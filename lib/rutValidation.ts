export function validateRut(rut: string): boolean {
    // Remove dots and hyphens
    rut = rut.replace(/\./g, '').replace('-', '');
    
    // Separate the digits from the verifier
    const rutDigits = rut.slice(0, -1);
    const verifier = rut.slice(-1).toLowerCase();
  
    // Calculate the expected verifier
    let sum = 0;
    let multiplier = 2;
  
    for (let i = rutDigits.length - 1; i >= 0; i--) {
      sum += parseInt(rutDigits[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const expectedVerifier = 11 - (sum % 11);
    const calculatedVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'k' : expectedVerifier.toString();
  
    return calculatedVerifier === verifier;
  }
  
  