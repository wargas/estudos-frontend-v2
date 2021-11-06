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
  console.log(children);
  return (
    <li {...props}>{children.map((item: any) => item?.props?.children)}</li>
  );
};
