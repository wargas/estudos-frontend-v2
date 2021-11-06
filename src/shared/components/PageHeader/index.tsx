import { useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

export type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  children?: any;
  backButton?: boolean;
  isLoading?: boolean;
  onBackPress?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  children,
  backButton = false,
  isLoading = false,
  onBackPress = () => {},
}: PageHeaderProps) {
  useEffect(() => {
    document.title = title || '';

    return () => { document.title = 'App Estudos' }
  }, []);


  if(isLoading) {
    return (
      <div className="flex animate-pulse border-b pb-3 items-center mb-3">
        <div>
          <div className="h-9 w-9 flex-center bg-gray-200 mr-3 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-6 rounded  w-72 bg-gray-200 text-gray-200"></div>
          <div className="h-4 rounded w-48 flex bg-gray-100"></div>
        </div>
        <div className='flex animate-pulse gap-3 ml-auto'>
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex border-b pb-3 items-center mb-3'>
      {backButton && (
        <button
          onClick={() => onBackPress()}
          className='h-9 w-9 flex-center bg-gray-100 mr-3 rounded-full'>
          <FaChevronLeft />
        </button>
      )}
      <div>
        <h1 className='text-2xl'>{title || '-'}</h1>
        {subtitle && <p className='text-gray-400 text-sm'>{subtitle}</p>}
      </div>
      <div className='flex ml-auto'>{children}</div>
    </div>
  );
}
