import { ComputerIcon, File, MessageCircle, PlusIcon } from "lucide-react";

export const Header = (props) => {
    const {
        newUploadHandler,
        isPDFVisible,
        setIsPDFVisible
    } = props;

    return (
        <header className="fixed z-10 top-0 h-16 xs:h-16 bg-purple-100/80 border border-purple-100/70 shadow-sm p-[15px] w-full md:w-[55%]">
            <div className="flex justify-between items-center">
              <div className="flex gap-[12px] items-center">
                <ComputerIcon className="text-purple-800" />
                <strong className="text-purple-800">notebooklm-clone</strong>
              </div>
              <div className="flex gap-[12px] items-center">
                <button onClick={newUploadHandler} className="flex gap-0 items-center border border-purple-800 shadow-md pl-1 pr-1 sm:pr-2 py-2 rounded-md cursor-pointer hover:bg-purple-200">
                  <PlusIcon className="text-purple-800 h-4" />
                  <span className="hidden md:block text-xs text-purple-800">New Upload</span>
                </button>
                <button onClick={(e) => setIsPDFVisible(prev => !prev)} className="sm:hidden flex gap-0 items-center border border-purple-800 shadow-md px-1 py-2 rounded-md cursor-pointer hover:bg-purple-200">
                  {isPDFVisible ? <MessageCircle className="text-purple-800 h-4" /> : <File className="text-purple-800 h-4" />}
                </button>
              </div>
            </div>
        </header>
    )
}