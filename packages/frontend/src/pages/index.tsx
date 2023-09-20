import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import MainLayout from "src/layout/MainLayout";
import { dummyModuleData } from "./staticData";

function BasePage() {
    return (
        <MainLayout>
            <DragDropContext onDragEnd={() => {}}>
                <div className="grid grid-cols-1 twoCol:grid-cols-2 threeCol:grid-cols-3 fourCol:grid-cols-4 gap-4">
                    {dummyModuleData.map((moduleData, index) => (
                        <Droppable droppableId="alphaday">
                            {(provided) => (
                                <div ref={provided.innerRef}>
                                    <ModuleWrapper
                                        key={moduleData.id}
                                        moduleData={moduleData}
                                        rowIndex={index}
                                        colIndex={index}
                                    />
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </MainLayout>
    );
}

export default BasePage;
