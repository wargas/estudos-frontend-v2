import { FC } from 'react';
import {
  useColumnOrder,
  useFilters,
  useRowSelect, useTable
} from 'react-table';

type Props = {
  columns: any[];
  data: any[];
};

const Table: FC<Props> = ({ columns, data }) => {
  const instance = useTable(
    { data, columns },
    useColumnOrder,
    useFilters,
    useRowSelect,
  );

  return (
    <div className=''>
      <table className='w-full border-collapse' {...instance.getTableProps()}>
        <thead>
          {instance.headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className='h-10 px-4 text-left cursor-pointer' {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y' {...instance.getTableBodyProps()}>
          {instance.rows.map((row) => {
            instance.prepareRow(row);
            return (
              <tr className='even:bg-gray-100 hover:bg-gray-50' {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td className='h-10 px-4' {...cell.getCellProps()}>
                      {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
