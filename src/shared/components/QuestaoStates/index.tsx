import { Respondida } from "../../interfaces";

type Props = {
    respondidas: Respondida[]
}

export default function QuestaoStates({respondidas}: Props) {
    return (
        <div className='flex items-center gap-1'>
            {respondidas
              .filter((_, index, arr) => index >= arr.length - 10)
              .map((respondida) => (
                <div
                  key={respondida.id}
                  className={`${
                    respondida.acertou ? 'bg-green-500' : 'bg-red-500'
                  } w-4 h-2 rounded-full cursor-pointer`}></div>
              ))}
          {(respondidas.length || 0) < 10 &&
            Array(10 - (respondidas.length || 0))
              .fill('')
              .map((_, key) => (
                <div
                  key={key}
                  className={`bg-gray-200 w-4 h-2 rounded-full`}></div>
              ))}
        </div>
    )
}