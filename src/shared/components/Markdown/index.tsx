import MarkdownToJSX from 'markdown-to-jsx';
import { FC } from 'react';

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
        },
      }}>
      {markdown
        .split('\n')
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
