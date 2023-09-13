'use client';
import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

const Board = () => {
  const [board, getBoard, setBoardState] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  // console.log(Array.from(board.columns.entries()));

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // console.log(destination);
    // console.log(source);
    // console.log(type);

    // Check if user dragged card outside of board
    if (!destination) return;

    // Handle column drag
    if (type === 'column') {
      const entries = Array.from(board.columns.entries());

      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // This step is needed as the indexes are stored as numbers 0,1,2 etc. Instead of id's with DND library. 
    const columns = Array.from(board.columns);
    console.log(columns)
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)]

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }

    if(!startCol || !finishCol) return; 

    if(source.index === destination.index && startCol === finishCol) return;


  };

  return (
    // 'e => handleOnDragEnd' 여기서 e의 타입(DropResult)을 알아낸 후 (hover) 지운다.
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid gird-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
