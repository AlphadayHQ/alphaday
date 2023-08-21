import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import MainLayout from "src/layout/MainLayout";
import { dummyModuleData } from "./staticData";

function BasePage() {
    return (
        <MainLayout>
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
        </MainLayout>
    );
}

export default BasePage;
