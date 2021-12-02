import { green } from './chalk'

const acceptPrefix = 'abcdefghijklmnopqrstuvwxyz_'.split('')
const acceptChars = 'abcdefghijklmnopqrstuvwxyz_-0123456789'.split('')

function stripEscapeSequence (words: string) {
  return words.replace(/\\/g, '')
}

export interface IGenerateOption {
  classGenerator?: Function
  reserveClassName?: string[]
  debug?: boolean
}

export default class ClassGenerator {
  newClassMap: Record<string, any>
  newClassSize: number
  context: Record<string, any>
  constructor () {
    this.newClassMap = {}
    this.newClassSize = 0
    this.context = {}
  }

  defaultClassGenerator () {
    const chars = []
    let rest =
      (this.newClassSize - (this.newClassSize % acceptPrefix.length)) /
      acceptPrefix.length
    if (rest > 0) {
      while (true) {
        rest -= 1
        const m = rest % acceptChars.length
        const c = acceptChars[m]
        chars.push(c)
        rest -= m
        if (rest === 0) {
          break
        }
        rest /= acceptChars.length
      }
    }
    const prefixIndex = this.newClassSize % acceptPrefix.length

    const newClassName = `${acceptPrefix[prefixIndex]}${chars.join('')}`
    return newClassName
  }

  generateClassName (original: string, opts: IGenerateOption) {
    original = stripEscapeSequence(original)
    const cn = this.newClassMap[original]
    if (cn) return cn

    let newClassName
    if (opts.classGenerator) {
      newClassName = opts.classGenerator(original, opts, this.context)
    }
    if (!newClassName) {
      newClassName = this.defaultClassGenerator()
    }

    if (opts.reserveClassName && opts.reserveClassName.includes(newClassName)) {
      if (opts.debug) {
        console.log(
          `The class name has been reserved. ${green(newClassName)}`
        )
      }
      this.newClassSize++
      return this.generateClassName(original, opts)
    }
    if (opts.debug) {
      console.log(
        `Minify class name from ${green(original)} to ${green(
          newClassName
        )}`
      )
    }
    const newClass = {
      name: newClassName,
      usedBy: []
    }
    this.newClassMap[original] = newClass
    this.newClassSize++
    return newClass
  }
}
