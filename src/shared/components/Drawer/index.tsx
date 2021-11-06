import { Transition } from '@headlessui/react';
import { createContext, useContext, useState } from 'react';

export type ComponentProps = {
  data?: any;
  closeDrawer?: (data: any) => void;
  setWidth: (value: string) => void
};
export type ComponentType = (props: ComponentProps) => JSX.Element;
export type DrawerContextProps = {
  openDrawer: (
    Component: ComponentType,
    data?: any,
    callback?: (data: any) => void
  ) => void;
  closeDrawer: (data: any) => void;
};

export const DrawerContext = createContext<DrawerContextProps>(
  {} as DrawerContextProps
);


export function DrawerProvider(props: any) {
  const [Component, setComponet] = useState<ComponentType>();
  const [data, setData] = useState<any>();
  const [width, setWidth] = useState('72')
  const [callbackFn, setCallbackFn] = useState<(data: any) => void>();

  function openDrawer(
  _Component: ComponentType,
    data = null,
    callback = (data: any) => {}
  ) {
    setComponet(() => _Component);
    setCallbackFn(() => callback);
    setData(data);
  }

  function closeDrawer(data = null) {
    if (callbackFn) {
      callbackFn(data);
    }
    setComponet(undefined);
    setData(undefined);
    setCallbackFn(undefined);
    setWidth('72')
  }

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {props.children}
      <Transition show={!!Component}>
        <div className='inset-0 absolute max-h-screen overflow-y-hidden'>
          <div
            onClick={() => closeDrawer(null)}
            className='inset-0 absolute cursor-pointer z-10 bg-black opacity-20'></div>
          
          <Transition.Child
            className={`absolute top-0 bottom-0 w-${width} bg-white z-50 right-0`}
            enter={`transition-all ease-linear`}
            enterFrom={`transform translate-x-${width}`}
            enterTo={`transform -translate-x-0 opacity-100`}
            leave={`transition-all ease-linear duration-100`}
            leaveFrom={`transform -translate-x-0`}
            leaveTo={`transform translate-x-${width}`}
            as={'div'}
            >
            {Component && <Component setWidth={setWidth} data={data} closeDrawer={closeDrawer} />}
          </Transition.Child>
        </div>
      </Transition>
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const { openDrawer } = useContext(DrawerContext);
  return openDrawer;
}
