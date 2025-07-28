import { useChat } from 'ai/react';
import { UploadCloudIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export const UploadChatPanel = (props) => {
    const {
        id,
        pdfUrl,
        handleDrop
    } = props;

    const messageEnd = useRef();
    const inputRef = useRef();
    const updateRef = useRef();

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: `/api/chat`,
        body: { id },
        initialMessages: [
            {
              id: 'initial',
              role: 'assistant',
              content: `Hello! Ask me anything from the PDF that you uploaded jusst now.`,
            },
        ],
    });

    useEffect(() => {
        if (messages.length > 1) {
            messageEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className={`flex ${pdfUrl === '' ? 'items-center' : 'items-start'} justify-center h-screen`}>
            {pdfUrl === '' ? 
                <div 
                    onClick={() => updateRef.current.click()} 
                    onDrop={handleDrop} 
                    onDragOver={(event) => event.preventDefault()}  
                    className="flex flex-col gap-[10px] justify-center items-center p-10 bg-purple-100/60 border border-purple-100/70 shadow-sm rounded-xl hover:bg-purple-100/100 cursor-pointer"
                >
                    <UploadCloudIcon className="text-purple-800" />
                    <h1 className="text-sm font-bold text-purple-800">Upload a PDF file</h1>
                    <span className="text-[10px] font-semibold text-purple-800">Click here or drag and drop your file here</span>
                    <input className="hidden" ref={updateRef} type="file" onChange={handleDrop} />
                </div> :
                <>
                    <div className={`message-container max-h-[80vh] max-w-screen-md mx-auto w-full flex flex-col gap-1 px-0 pb-4 mt-0 pt-5 md:px-4 md:pb-4 md:pt-5 lg:px-4 xl:px-4 2xl:px-4 overflow-y-auto`}>
                        <>
                            {messages.map((msg, idx) => (
                                <div className={`${msg.role === 'user' ? 'flex justify-end ' : 'flex'} px-[10px]`} key={idx} style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                                    <>
                                        {msg.role === 'user' ? <div className='text-purple-800 text-xs font-semibold w-auto my-[10px] py-[10px] px-[20px] rounded-lg border-[1px] border-purple-500 shadow-md'>
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div> :
                                        <div className={`flex bg-purple-100 text-purple-800 rounded-lg gap-[15px] py-[10px] px-[10px] border-[1px] border-gray-100 shadow-md`}>
                                            <div className="flex gap-[10px]">
                                                <span className='bg-white text-purple-800 font-semibold rounded-full py-[5px] px-[12px] h-[32px]'>P</span>
                                                <div className='flex flex-col justify-center w-auto text-xs font-semibold'>
                                                <ReactMarkdown >{msg.content}</ReactMarkdown> 
                                                </div>
                                            </div>
                                        </div>}
                                    </>
                                </div>
                            ))}
                            {isLoading && (
                                <div className='flex gap-2 px-[20px]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.0" width="100px" height="64px" viewBox="0 0 512 50" xmlSpace="preserve">
                                        <circle cx="0" cy="0" r="11" transform="translate(16 16)">
                                            <animateTransform attributeName="transform" type="scale" additive="sum" values="1;1.42;1;1;1;1;1;1;1;1" dur="1050ms" repeatCount="indefinite"></animateTransform>
                                        </circle>
                                        <circle cx="0" cy="0" r="11" transform="translate(64 16)">
                                            <animateTransform attributeName="transform" type="scale" additive="sum" values="1;1;1;1;1.42;1;1;1;1;1" dur="1050ms" repeatCount="indefinite"></animateTransform>
                                        </circle>
                                        <circle cx="0" cy="0" r="11" transform="translate(112 16)">
                                            <animateTransform attributeName="transform" type="scale" additive="sum" values="1;1;1;1;1;1;1;1.42;1;1" dur="1050ms" repeatCount="indefinite"></animateTransform>
                                        </circle>
                                    </svg>
                                </div>
                            )}
                            <div ref={messageEnd} />
                        </>
                    </div>
                    <form className='fixed md:!bg-white bottom-0 flex max-w-screen-md mx-auto w-full flex-col items-center space-y-4 p-3 pb-3 sm:px-0'
                        onSubmit={(event) => {
                        if (!isLoading) {
                            handleSubmit(event);
                            inputRef.current.blur();
                        }
                        }}
                    >
                        <div className='bg-purple-100 flex items-center rounded-lg py-[10px] px-[10px] w-[100%]'>
                            <textarea
                                ref={inputRef}
                                className='bg-purple-100 text-purple-800 font-semibold w-[90%] outline-none resize-none text-[14px] placeholder-gray-500'
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') { 
                                        handleSubmit(event); 
                                    }
                                }}
                                placeholder="Ask me anything..."
                            />
                            <div className='flex justify-end w-[10%]'>
                                <button type='submit' className={`bg-purple-800 rounded-full py-[8px] pl-[10px] pr-[6px] duration-500 ${input === '' ? 'opacity-0' : 'opacity-100'}`}>
                                    <Image
                                        src="/send.png"
                                        width={20}
                                        height={20}
                                        alt="Send Message"
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                </>}
        </div>
    )
}