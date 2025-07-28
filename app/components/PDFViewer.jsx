"use client";

import { ArrowLeftCircleIcon, ArrowRightCircleIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer (props) {
    const {
        pdfUrl,
        isMobile,
        isScanning,
        currentPage,
        setCurrentPage,
        numPages,
        onDocumentLoadSuccess
    } = props;
    return (
        <div className={`flex flex-col w-[90%] md:w-[45%] items-center border border-purple-100/70 shadow-sm h-screen ${isMobile ? 'mt-[55px]' : ''}`}>
          {pdfUrl ? (
            <div className="flex flex-col justify-center">
              <Document className='w-full' file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page height={window.outerWidth > 768 ? 700 : 450} className="p-0 h-[50%]" pageNumber={currentPage} />
              </Document>
              {numPages > 1 && <div className="flex gap-5 justify-center items-center">
                <button className="cursor-pointer" disabled={currentPage === 0} onClick={() => {
                  if (currentPage !== 1) {
                    setCurrentPage(prev => prev - 1)
                  }
                }}>
                  <ArrowLeftCircleIcon className="text-purple-800" />
                </button>
                <button className="cursor-pointer" disabled={currentPage === numPages} onClick={() => {
                  if (currentPage !== numPages) {
                    setCurrentPage(prev => prev + 1)
                  }
                }}>
                  <ArrowRightCircleIcon className="text-purple-800" />
                </button>
              </div>}
            </div>
          ) : <div className="flex flex-col items-center justify-center w-full h-screen">
            {isScanning ? <>
              <Loader2 className="w-10 h-10 text-purple-800 animate-spin" />
              <span className="mt-5 text-[12px] font-semibold">Processing your document.</span>
            </>: 
            <>
              <Image alt="SynCS Logo" src={'/pdf_ph.png'} height={300} width={300} />
              <span className="text-[12px] font-semibold">Please upload a PDF document in the left panel.</span>
            </>}
          </div>}
        </div>
    )
}