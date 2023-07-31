import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import { dummyModuleData } from "./staticData";

function BasePage() {
    return (
        <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="alphaday">
                {(_provided) => (
                    <>
                        {dummyModuleData.map((moduleData, index) => (
                            <ModuleWrapper
                                key={moduleData.id}
                                moduleData={moduleData}
                                rowIndex={index}
                                colIndex={index}
                            />
                        ))}
                    </>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default BasePage;
