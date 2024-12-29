import { clamp } from './math'

export type EaseFunction = (t: number) => number

export class EaseFunctions {
  static cubicBezierGeneric(x1: number, y1: number, x2: number, y2: number): { x: EaseFunction, y: EaseFunction } {
    // Calculate the x and y coordinates using the cubic Bézier formula
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx

    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by

    // Compute x and y values at parameter t
    const x = (t: number) => ((ax * t + bx) * t + cx) * t
    const y = (t: number) => ((ay * t + by) * t + cy) * t

    return {
      x,
      y
    }
  }

  static cubicBezier(x1: number, y1: number, x2: number, y2: number): EaseFunction {
    const { y } = EaseFunctions.cubicBezierGeneric(x1, y1, x2, y2)
    return (t: number) => {
      t = clamp(t)
      return y(t) // <= equal to x(t) * 0 + y(t) * 1
    }
  }

  static easeInEaseOut(t: number): number {
    return EaseFunctions.cubicBezier(0.65, 0, 0.35, 1)(t)
  };
}
