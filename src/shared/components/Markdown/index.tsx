import 'katex/dist/katex.min.css';
import MarkdownToJSX from 'markdown-to-jsx';
import { FC } from 'react';
import Latex from 'react-latex-next';


export function Markdown({ markdown }: any) {
  return (
    <MarkdownToJSX
      options={{
        forceBlock: false,
        overrides: {
          li: {
            component: ListUn,
            props: {},
          },
          img: {
            component:Image,
            props: {}
          },
          Row: {
            component: Row,
            props: {}
          },
          Col: {
            component: Col,
            props: {}
          },
          Latex: {
            component: FormulaInline,
            props: {}
          }
        },
      }}>
      {markdown
        .split('\n')
        .map((line: string) => line.replace(/\$\$(.*)\$\$/g, "<Latex>$ $1 $</Latex>"))
        .map((item: string) => `${item.startsWith('|') ? '' : '\n' }${item}\n`)
        .join('')}
    </MarkdownToJSX>
  );
}

const ListUn: FC<any> = ({ children, ...props }) => {
  return (
    <li {...props}>{children.map((item: any) => item?.props?.children)}</li>
  );
};



const Image = ({children, ...props}: any) => {
  return <img className="shadow-sm rounded" style={{display: 'inline-block'}} src={props?.src} alt={props?.alt} />
}

const Row = ({children, ...props}: any) => {
  return <div className="flex">
    {children}
  </div>
}

const Col = ({children, ...props}: any) => {
  return <div className="flex-1">
    {children}
  </div>
}

const FormulaInline = ({children, ...props}: any) => {

  return children.map((child: any) => (
    <Latex key={child}>{child}</Latex>
  )) 
}