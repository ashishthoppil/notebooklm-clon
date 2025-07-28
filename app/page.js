"use client"

import { useEffect, useState } from "react";

import { Header } from "./components/Header";
import { UploadChatPanel } from "./components/UploadChatPanel";
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./components/PDFViewer').then(mod => mod.default), {
  ssr: false,
});

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [id, setId] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isPDFVisible, setIsPDFVisible] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer ? event.dataTransfer.files : event.target.files
    if (droppedFile.length > 1) {
      toast.error('Please upload a single file.')
    } else {
      const formData = new FormData()
      formData.append('file', droppedFile[0])
      setIsScanning(true);
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const fileBlobUrl = URL.createObjectURL(droppedFile);
        setPdfUrl(fileBlobUrl);
        setIsScanning(false)
        setId(data.id)
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsPDFVisible(!isNowMobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const newUploadHandler = () => {
    setPdfUrl('');
    setNumPages(null)
    setId('')
    setCurrentPage(1)
  }

  return (
      <main className="flex flex-col md:flex-row w-full h-screen items-center">
        <div className={`flex flex-col ${pdfUrl === '' ? 'justify-center' : 'justify-start'} w-full md:w-[55%] ${isMobile && isPDFVisible ? '' : 'h-screen'} pt-15`}>
          {/* Header */}
            <Header 
              newUploadHandler={newUploadHandler} 
              setIsPDFVisible={setIsPDFVisible}
              isPDFVisible={isPDFVisible}
            />
          {/* Header Ends */}
          {/* Chat Section & Upload section*/}
          {(isMobile && !isPDFVisible) || (!isMobile) ? <UploadChatPanel id={id} pdfUrl={pdfUrl} handleDrop={handleDrop} /> : <></>}
          {/* Chat section ends */}
        </div>
        {/* PDF Section */}
        {isPDFVisible && (
          <PDFViewer 
            pdfUrl={pdfUrl}
            isScanning={isScanning}
            isMobile={isMobile} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numPages={numPages}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
          />
        )}
        {/* PDF Section ends */}
      </main>
  );
}
