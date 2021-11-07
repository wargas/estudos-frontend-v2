import { useEffect, useState } from "react"

export const useQueue = <T = any>(_items: T[] = []) => {

    const [items, setItems] = useState<T[]>(_items)
    const [position, setPosition] = useState<number>(0)
    const [current, setCurrent] = useState(_items[0])
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    useEffect(() => {
        if (position !== undefined && items.length > 0) {
            if (position > items.length - 1) {
                setPosition(items.length - 1)
            }
            setCurrent(items[position])

            if (position < items.length - 1) {
                setHasNext(true)
            } else {
                setHasNext(false)
            }

            if (position === 0) {
                setHasPrev(false)
            } else {
                setHasPrev(true)
            }
        }
    }, [position, items])

    function next() {
        if (position + 1 < items.length) {
            setPosition(old => old + 1)
        }
    }

    function prev() {
        if (position > 0) {
            setPosition(old => old - 1)
        }
    }

    function remove(_item: T) {
        setItems(items => items.filter(it => it !== _item))
    }

    function goto(_item: T) {
        setPosition(items.indexOf(_item))
    }

    return { items, next, prev, remove, current, position, goto, hasNext, hasPrev }

}