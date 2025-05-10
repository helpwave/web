type ASTNodeModifierType =
  'none'
  | 'italic'
  | 'bold'
  | 'underline'
  | 'font-space'
  | 'primary'
  | 'secondary'
  | 'warn'
  | 'positive'
  | 'negative'

const astNodeInserterType = ['helpwave', 'newline'] as const
type ASTNodeInserterType = typeof astNodeInserterType[number]
type ASTNodeDefaultType = 'text'

type ASTNode = {
  type: ASTNodeModifierType,
  children: ASTNode[],
} | {
  type: ASTNodeInserterType,
} | {
  type: ASTNodeDefaultType,
  text: string,
}

export type ASTNodeInterpreterProps = {
  node: ASTNode,
  isRoot?: boolean,
  className?: string,
}
export const ASTNodeInterpreter = ({
                                     node,
                                     isRoot = false,
                                     className = '',
                                   }: ASTNodeInterpreterProps) => {
  switch (node.type) {
    case 'newline':
      return <br/>
    case 'text':
      return isRoot ? <span className={className}>{node.text}</span> : node.text
    case 'helpwave':
      return (<span className="font-bold font-space no-underline">helpwave</span>)
    case 'none':
      return isRoot ? (
<span className={className}>{node.children.map((value, index) => (
<ASTNodeInterpreter key={index}
                                                                                                           node={value}/>
))}</span>
) :
        <>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</>
    case 'bold':
      return <b>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</b>
    case 'italic':
      return <i>{node.children.map((value, index) => <ASTNodeInterpreter key={index} node={value}/>)}</i>
    case 'underline':
      return (<u>{node.children.map((value, index) => (<ASTNodeInterpreter key={index} node={value}/>))}</u>)
    case 'font-space':
      return (
        <span className="font-space">{node.children.map((value, index) => (
          <ASTNodeInterpreter key={index}
                              node={value}/>
        ))}</span>
      )
    case 'primary':
      return (
        <span className="text-primary">{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'secondary':
      return (
        <span className="text-secondary">{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'warn':
      return (
        <span className="text-warning">{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'positive':
      return (
        <span className="text-positive">{node.children.map((value, index) => (
          <ASTNodeInterpreter
            key={index} node={value}/>
        ))}</span>
      )
    case 'negative':
      return (
        <span className="text-negative">{node.children.map((value, index) => (
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
  { id: 'secondary', name: 'secondary' },
  { id: 'warn', name: 'warn' },
  { id: 'positive', name: 'positive' },
  { id: 'negative', name: 'negative' },
] as const

const inserterIdentifierMapping = [
  { id: 'helpwave', name: 'helpwave' },
  { id: 'newline', name: 'newline' }
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

const optimizeTree = (node: ASTNode) => {
  if (node.type === 'text') {
    return !node.text ? undefined : node
  }
  if (astNodeInserterType.some(value => value === node.type)) {
    return node
  }

  const currentNode = node as
    { type: ASTNodeModifierType, children: ASTNode[] }

  if (currentNode.children.length === 0) {
    return undefined
  }

  let children: ASTNode[] = []
  for (let i = 0; i < currentNode.children.length; i++) {
    const child = optimizeTree(currentNode.children[i]!)
    if (!child) {
      continue
    }
    if (child.type === 'none') {
      children.push(...child.children)
    } else {
      children.push(child)
    }
  }

  currentNode.children = children
  children = []

  for (let i = 0; i < currentNode.children.length; i++) {
    const child = currentNode.children[i]!
    if (child) {
      if (child.type === 'text' && children[children.length - 1]?.type === 'text') {
        (children[children.length - 1]! as { type: ASTNodeDefaultType, text: string }).text += child.text
      } else {
        children.push(child)
      }
    }
  }
  currentNode.children = children
  return currentNode
}

export type MarkdownInterpreterProps = {
  text: string,
  className?: string,
}

export const MarkdownInterpreter = ({ text, className }: MarkdownInterpreterProps) => {
  const tree = parseMarkdown(text)
  const optimizedTree = optimizeTree(tree)!
  return <ASTNodeInterpreter node={optimizedTree} isRoot={true} className={className}/>
}
