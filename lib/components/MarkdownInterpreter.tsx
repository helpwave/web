import { tw } from '../twind'

type ASTNodeModifierType =
  'none'
  | 'italic'
  | 'bold'
  | 'underline'
  | 'font-space'
  | 'primary'
  | 'warn'
  | 'positive'
  | 'negative'
/** Replaces the given ASTNode with a */
type ASTNodeInserterType = 'helpwave'
type ASTNodeDefaultType = 'text'

type ASTNode = {
  type: ASTNodeModifierType,
  children: ASTNode[]
} | {
  type: ASTNodeInserterType
} | {
  type: ASTNodeDefaultType,
  text: string
}

export type ASTNodeInterpreterProps = {
  node: ASTNode,
  isRoot?: boolean
}
export const ASTNodeInterpreter = ({
  node,
  isRoot = true
}: ASTNodeInterpreterProps) => {
  switch (node.type) {
    case 'text':
      return isRoot ? <span>{node.text}</span> : node.text
    case 'helpwave':
      return (<span className={tw('font-bold font-space no-underline')}>helpwave</span>)
    case 'none':
      return <>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</>
    case 'bold':
      return <b>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</b>
    case 'italic':
      return <i>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</i>
    case 'underline':
      return (
        <span className={tw('underline')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter key={index}
                              node={value}/>
        ))}</span>
      )
    case 'font-space':
      return (
        <span className={tw('font-space')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter key={index}
                              node={value}/>
        ))}</span>
      )
    case 'primary':
      return (
        <span className={tw('text-hw-primary-400')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'warn':
      return (
        <span className={tw('text-hw-warn-400')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'positive':
      return (
        <span className={tw('text-hw-positive-400')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'negative':
      return (
        <span className={tw('text-hw-negative-400')}>{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    default:
      return null
  }
}

const modifierIdentifierMapping = [
  { id: 'i', name: 'italic' },
  { id: 'b', name: 'bold' },
  { id: 'u', name: 'underline' },
  { id: 'space', name: 'font-space' },
  { id: 'primary', name: 'primary' },
  { id: 'warn', name: 'warn' },
  { id: 'positive', name: 'positive' },
  { id: 'negative', name: 'negative' },
] as const

const inserterIdentifierMapping = [
  { id: 'helpwave', name: 'helpwave' }
] as const
const parseMarkdown = (
  text: string,
  commandStart: string = '\\',
  open: string = '{',
  close: string = '}'
): ASTNode => {
  let start = text.indexOf(commandStart)
  const children: ASTNode[] = []

  // parse the text step by step
  while (text !== '') {
    if (start === -1) {
      children.push({
        type: 'text',
        text
      })
      break
    }
    children.push(parseMarkdown(text.substring(0, start)))
    text = text.substring(start)
    if (text.length <= 1) {
      children.push({
        type: 'text',
        text
      })
      text = ''
      continue
    }
    const simpleReplace = [commandStart, open, close]
    if (simpleReplace.some(value => text[1] === value)) {
      children.push({
        type: 'text',
        text: simpleReplace.find(value => text[1] === value)!
      })
      text = text.substring(2)
      start = text.indexOf(commandStart)
      continue
    }
    const inserter = inserterIdentifierMapping.find(value => text.substring(1).startsWith(value.id))
    if (inserter) {
      children.push({
        type: inserter.name,
      })
      text = text.substring(inserter.id.length + 1)
      start = text.indexOf(commandStart)
      continue
    }
    const modifier = modifierIdentifierMapping.find(value => text.substring(1).startsWith(value.id))
    if (modifier) {
      // check brackets
      if (text[modifier.id.length + 1] !== open) {
        console.log('no open', text.substring(0, 12), text[modifier.id.length + 2])
        children.push({
          type: 'text',
          text: text.substring(0, modifier.id.length + 1)
        })
        text = text.substring(modifier.id.length + 2)
        start = text.indexOf(commandStart)
        continue
      }
      let closing = -1
      let index = modifier.id.length + 2
      let counter = 1
      let escaping = false
      while (index < text.length) {
        if (text[index] === open && !escaping) {
          counter++
        }
        if (text[index] === close && !escaping) {
          counter--
          if (counter === 0) {
            closing = index
            break
          }
        }
        escaping = text[index] === commandStart
        index++
      }

      if (closing !== -1) {
        children.push({
          type: modifier.name,
          children: [parseMarkdown(text.substring(modifier.id.length + 2, closing))]
        })
        text = text.substring(closing + 1)
        start = text.indexOf(commandStart)
        continue
      }
    }
    // nothing could be applied to command start
    children.push({
      type: 'text',
      text: text[0]!
    })
    text = text.substring(1)
    start = text.indexOf(commandStart)
  }

  return {
    type: 'none',
    children
  }
}

export type MarkdownInterpreterProps = {
  text: string
}

export const MarkdownInterpreter = ({ text }: MarkdownInterpreterProps) => {
  const tree = parseMarkdown(text)
  console.log(tree)
  return <ASTNodeInterpreter node={tree}/>
}
