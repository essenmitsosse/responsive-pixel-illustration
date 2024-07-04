export const getGetRealDistanceWithMaxMin = (maxInput, minInput, Dim) => {
  const max = maxInput && new Dim(maxInput)
  const min = minInput && new Dim(minInput)
  if (max && min) {
    return function getRealDistanceWithMaxMin() {
      const realMin = typeof min === 'number' ? min : min.getReal()
      const realMax = typeof max === 'number' ? max : max.getReal()
      const realDistance = this.getRealDistance()
      if (realDistance > realMax) {
        return realMax < realMin ? realMin : realMax
      }
      return realDistance < realMin ? realMin : realDistance
    }
  }
  return max
    ? function getRealDistanceWithMax() {
        const realMax = typeof max === 'number' ? max : max.getReal()
        const realDistance = this.getRealDistance()
        return realDistance > realMax ? realMax : realDistance
      }
    : function getRealDistanceWithMin() {
        const realMin = typeof min === 'number' ? min : min.getReal()
        const realDistance = this.getRealDistance()
        return realDistance < realMin ? realMin : realDistance
      }
}
