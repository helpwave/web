/**
 *  1 is forwards
 *
 * -1 is backwards
 */
export type Direction = 1 | -1

export class LoopingArrayCalculator {
  length: number
  isLooping: boolean
  allowedOverScroll: number

  constructor(length: number, isLooping: boolean = true, allowedOverScroll: number = 0.1) {
    if (allowedOverScroll < 0 || length < 1) {
      throw new Error('Invalid parameters: allowedOverScroll >= 0 and length >= 1 must be true')
    }

    this.length = length
    this.isLooping = isLooping
    this.allowedOverScroll = allowedOverScroll
  }

  getCorrectedPosition(position: number): number {
    if (!this.isLooping) {
      return Math.max(-this.allowedOverScroll, Math.min(this.allowedOverScroll + this.length - 1, position))
    }
    if (position >= this.length) {
      return position % this.length
    }
    if (position < 0) {
      return this.length - (Math.abs(position) % this.length)
    }
    return position
  }

  static withoutOffset(position: number): number {
    return position + LoopingArrayCalculator.getOffset(position)
  }

  static getOffset(position: number): number {
    return Math.round(position) - position // For example: 45.5 => 46 - 45.5 = 0.5
  }

  /**
   * @return absolute distance forwards or Infinity when the target cannot be reached (only possible when not isLooping)
   */
  getDistanceDirectional(position: number, target: number, direction: Direction): number {
    if (!this.isLooping && (position < -this.allowedOverScroll || position > this.allowedOverScroll + this.length - 1)) {
      throw new Error('Invalid parameters: position is out of bounds.')
    }

    const isForwardInvalid = (direction === 1 && position > target)
    const isBackwardInvalid = (direction === -1 && target < position)

    if (!this.isLooping && (isForwardInvalid || isBackwardInvalid)) {
      return Infinity
    }

    if (direction === -1) {
      return this.getDistanceDirectional(target, position, 1)
    }

    position = this.getCorrectedPosition(position)
    target = this.getCorrectedPosition(target)

    let distance = (target - position) * direction
    if (distance < 0) {
      distance = this.length - (Math.abs(position) % this.length) + target
    }

    return distance
  }

  getDistanceForward(position: number, target: number): number {
    return this.getDistanceDirectional(position, target, 1)
  }

  getDistanceBackward(position: number, target: number): number {
    return this.getDistanceDirectional(position, target, -1)
  }

  getDistance(position: number, target: number): number {
    const forwardDistance = this.getDistanceForward(position, target)
    const backwardDistance = this.getDistanceBackward(position, target)

    return Math.min(forwardDistance, backwardDistance)
  }

  getBestDirection(position: number, target: number): Direction {
    const forwardDistance = this.getDistanceForward(position, target)
    const backwardDistance = this.getDistanceBackward(position, target)
    return forwardDistance < backwardDistance ? 1 : -1
  }
}
