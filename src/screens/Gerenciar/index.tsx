import { PageHeader } from '../../shared/components/PageHeader';
import { useQueue } from '../../shared/components/QueueHook';

export function Gerenciar() {
  const {
    current,
    items,
    next,
    prev,
    goto,
    remove,
    position,
    hasNext,
    hasPrev,
  } = useQueue<number>(
    Array(20)
      .fill('')
      .map((_, i) => i + 1001)
  );
  return (
    <div>
      <PageHeader title='Gerenciar'></PageHeader>

      <div>
        <div className='border p-3'>{items.join(', ')}</div>
        <div>
          {current} [{position}]
        </div>
        <div className='flex gap-2'>
          {hasPrev && <button onClick={prev}>Prev</button>}
          {hasNext && <button onClick={next}>Next</button>}
          <button onClick={() => remove(current)}>Remove</button>
          <button onClick={() => goto(1005)}>Ir para</button>
        </div>
      </div>
    </div>
  );
}
