import { ModalRegister } from '../modals/ModalRegister'
import { useState } from 'react'
import { ConfirmDialog } from '../modals/ConfirmDialog'
import { Button } from '../Button'
import { tw } from '../../twind'
import { modalRootName } from '../modals/Modal'

/**
 * An Example Component for Stacking Modals
 */
export const StackingModals = () => {
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)

  return (
    <ModalRegister>
      <ConfirmDialog
        id="1"
        isOpen={modal1}
        onConfirm={() => setModal1(false)}
        onBackgroundClick={() => setModal1(false)}
        onCloseClick={() => setModal1(false)}
        modalClassName={tw('!bg-yellow-200 min-h-[300px]')}
      >
        {'I\'m Modal 1'}
        <Button onClick={() => setModal2(true)}>Open Modal 2</Button>
      </ConfirmDialog>
      <ConfirmDialog
        id="2"
        isOpen={modal2}
        onConfirm={() => setModal2(false)}
        onBackgroundClick={() => setModal2(false)}
        onCloseClick={() => setModal2(false)}
        modalClassName={tw('!bg-green-200 min-w-[300px]')}
      >
        {'The next layer of Modals!'}
        {'This is Modal 2'}
        <Button onClick={() => setModal3(true)}>Open Modal 3</Button>
      </ConfirmDialog>
      <ConfirmDialog
        id="3"
        isOpen={modal3}
        onConfirm={() => setModal3(false)}
        onBackgroundClick={() => setModal3(false)}
        onCloseClick={() => setModal3(false)}
      >
        This is Modal 3!
      </ConfirmDialog>
      <div className={tw('flex flex-row items-center justify-center min-h-[400px]')} id={modalRootName}>
        <Button onClick={() => setModal1(true)}>Open Modal 1</Button>
      </div>
    </ModalRegister>
  )
}
