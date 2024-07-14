function hashStringToInt(str: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash + str.charCodeAt(i)) % max;
    }
    return hash;
  }

export {
    hashStringToInt
}