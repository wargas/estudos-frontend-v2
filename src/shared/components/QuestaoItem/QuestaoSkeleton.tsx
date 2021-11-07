export function QuestaoSkeleton() {
  return (
    <div className='py-5 px-8 flex animate-pulse flex-col gap-1'>
      <div className='h-6 bg-gray-200 w-1/3 rounded'></div>
      <div className='h-2'></div>
      <div className='h-6 bg-gray-200 w-3/4 rounded'></div>
      <div className='h-6 bg-gray-200 w-2/3 rounded'></div>
      <div className='h-6 bg-gray-200 w-2/3 rounded'></div>
      <div className='h-4'></div>
      <div className='flex gap-3'>
        <div className='h-10 w-10 bg-gray-200 rounded'></div>
        <div className='flex-1 flex gap-1 flex-col'>
          <div className='h-4 bg-gray-200 w-1/3 rounded'></div>
          <div className='h-4 bg-gray-200 w-3/4 rounded'></div>
        </div>
      </div>
      <div className='h-2'></div>
      <div className='flex gap-3'>
        <div className='h-10 w-10 bg-gray-200 rounded'></div>
        <div className='flex-1 flex gap-1 flex-col'>
          <div className='h-4 bg-gray-200 w-1/3 rounded'></div>
          <div className='h-4 bg-gray-200 w-3/4 rounded'></div>
        </div>
      </div>
    </div>
  );
}
