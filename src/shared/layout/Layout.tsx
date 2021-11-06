import Header from './Header';
import Sidebar from './Sidebar';

export default function (props: any) {
  return (
    <div className="text-base">
      <div className='absolute bg-gray-50 flex flex-col left-64 top-0 right-0 bottom-0'>
        <Header />
        <div className='flex-1 p-5 overflow-y-scroll scroll '>          
          {props.children}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
