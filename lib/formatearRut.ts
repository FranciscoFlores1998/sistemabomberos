 export function clean (rut) {
    return typeof rut === 'string'
      ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
      : ''
  }
  
  export function validate (rut) {
    if (typeof rut !== 'string') {
      return false
    }
  
    if (!/^([1-9]\d{0,2}(\.?\d{3})*)-?[\dkK]$/.test(rut)) {
      return false
    }
  
    rut = clean(rut)
  
    let t = parseInt(rut.slice(0, -1), 10)
    let m = 0
    let s = 1
  
    while (t > 0) {
      s = (s + (t % 10) * (9 - (m++ % 6))) % 11
      t = Math.floor(t / 10)
    }
  
    const v = s > 0 ? '' + (s - 1) : 'K'
    return v === rut.slice(-1)
  }
  
  export function format (rut, options = {
    dots: true
  }) {
    // If the input is not a string, return an empty string
    if (!rut) { return '' }
  
    rut = clean(rut)
  
    let result
    if (options.dots) {
      result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
      for (let i = 4; i < rut.length; i += 3) {
        result = rut.slice(-3 - i, -i) + '.' + result
      }
    } else {
      result = rut.slice(0, -1) + '-' + rut.substr(rut.length - 1)
    }
  
    return result
  }
  
  export function getCheckDigit (input) {
    const rut = Array.from(clean(input), Number)
  
    if (rut.length === 0 || rut.includes(NaN)) {
      throw new Error(`"${input}" as RUT is invalid`)
    }
  
    const modulus = 11
    const initialValue = 0
    const sumResult = rut
      .reverse()
      .reduce(
        (accumulator, currentValue, index) =>
          accumulator + currentValue * ((index % 6) + 2),
        initialValue
      )
  
    const checkDigit = modulus - (sumResult % modulus)
  
    if (checkDigit === 10) {
      return 'K'
    } else if (checkDigit === 11) {
      return '0'
    } else {
      return checkDigit.toString()
    }
  }
  
