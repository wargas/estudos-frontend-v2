export default function useSort<T = any>(data: T[], fnc: (item: T) => any, sort: 'asc' | 'desc' = 'asc') {

    return data.sort((a: T, b: T) => {

        if(fnc(a) > fnc(b)) {
            sort === 'asc'? 1 : -1
        }       

        return 0
    })
}
