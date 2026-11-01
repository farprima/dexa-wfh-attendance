import { type ReactNode, useEffect, useRef } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  return (
    <dialog ref={dialog} onClose={onClose}>
      <h2>{title}</h2>
      {children}
    </dialog>
  )
}
