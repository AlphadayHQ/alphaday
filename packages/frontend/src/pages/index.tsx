import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import { dummyModuleData } from "./staticData";

function BasePage() {
    return (
        <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="alphaday">
                {(provided) => (
                    <div ref={provided.innerRef}>
                        {dummyModuleData.map((moduleData, index) => (
                            <ModuleWrapper
                                key={moduleData.id}
                                moduleData={moduleData}
                                rowIndex={index}
                                colIndex={index}
                            />
                        ))}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default BasePage;
