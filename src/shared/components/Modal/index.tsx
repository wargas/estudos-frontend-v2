import { Transition } from '@headlessui/react';
import { createContext, useContext, useState } from 'react';

export type ComponentProps = {
  data?: any;
  closeModal: (data: any) => void;
  setWidth: (value: string) => void;
};
export type ComponentType = (props: ComponentProps) => JSX.Element;

export type ModalContextProps = {
  openModal: (
    Component: ComponentType,
    data: any,
    callback: (data: any) => void
  ) => void;
  closeModal: (data: any) => void;
};

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);

export function ModalProvider(props: any) {
  const [_Component, setComponet] = useState<ComponentType>();
  const [data, setData] = useState<any>();
  const [width, setWidth] = useState('72')
  const [callbackFn, setCallbackFn] = useState<(data: any) => void>();

  function openModal(
    Component: ComponentType,
    data = null,
    callback = (data: any) => {}
  ) {
    setComponet(() => Component);
    setCallbackFn(() => callback);
    setData(data);
  }

  function closeModal(data = null) {
    if (callbackFn) {
      callbackFn(data);
    }
    setComponet(undefined);
    setData(undefined);
    setCallbackFn(undefined);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {props.children}
      <Transition show={!!_Component}>
        <div className='inset-0 fixed flex items-center justify-center'>
          <div
            onClick={() => closeModal(null)}
            className='inset-0 fixed cursor-pointer  bg-black opacity-50'></div>
          <Transition.Child
            as={'div'}
            className={`w-${width} relative rounded-lg  bg-white overflow-hidden shadow-lg `}
            enter="transition-all ease-out duration-300"
            leave="transition-all ease-in duration-300"
            enterFrom="transform scale-95 opacity-20"
            enterTo="transform scale-100 opacity-100"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-20"
            >
            {_Component && <_Component data={data} setWidth={setWidth} closeModal={closeModal} />}
          </Transition.Child>
        </div>
      </Transition>
    </ModalContext.Provider>
  );
}

export function useModal(Component: ComponentType, callback: (data: any) => void = () => {}) {
  const { openModal } = useContext(ModalContext);

  function dispach(data: any) {
    openModal(Component, data, callback)
  }

  return dispach;
}
