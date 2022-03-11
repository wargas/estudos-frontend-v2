export default function useSort<T = any>(data: T[], field: string, direction: 'asc' | 'desc') {

    return data.sort((a: T, b: T) => {



        console.log(getValue(a, 'caderno.total'))

        return 0
    })
}

function getValue(obj: any, key: string) {
    return Object.entries(obj)
}