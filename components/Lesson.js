import { useState, useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { HiLockClosed } from 'react-icons/hi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Script from 'next/script';

export default function Lesson({ name, message, index, link, courseId, lessonId, contentId }) {

  const lessonNumber = index + 1;
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContentData = async () => {
        try {
          const contentRef = doc(
            db,
            'courses',
            courseId,
            'lessons',
            lessonId,
            'content',
            lessonId // Use lessonId as the document ID in the content subcollection
          );
          const contentDoc = await getDoc(contentRef);
          if (contentDoc.exists()) {
            setContent(contentDoc.data());
          }
        } catch (error) {
          console.error('Error fetching content data:', error);
        }
      };
      
      

    fetchContentData();
  }, [courseId, lessonId, contentId]);

  const handleLesson = () => {
    window.location.href(link);
  }  

  return (
    <>
        {/* <button
            data-tf-popup={link}
            data-tf-opacity="100"
            data-tf-hide-headers
            data-tf-size="100"
            data-tf-auto-close
            data-tf-transitive-search-params
            data-tf-medium="snippet"
        >
            <div className="bg-[#262626] px-5 py-5 rounded-2xl flex justify-start items-center gap-3 cursor-pointer" >
                <p className="text-[#5e5e5e]">{lessonNumber}</p>
                <div className='bg-[#F9C602] text-black p-2 rounded-full'>
                <FaGraduationCap size={20}/>
                </div>
                <div className='flex justify-between items-center w-full'>
                <h1 className='text-[#aaaaaa] text-2xl'>{name}</h1>
                <h1 className='text-[#5e5e5e]'>{duration}</h1>
                </div>
            </div>
        </button>
        <Script src="//embed.typeform.com/next/embed.js" /> */}
          <div className="bg-[#262626] px-5 py-5 rounded-2xl flex justify-start items-center gap-3 cursor-pointer" >
            <p className="text-[#5e5e5e]">{lessonNumber}</p>
            <div className='bg-[#525152] p-2 rounded-full'>
            <HiLockClosed size={20}/>
            </div>
            <div className='flex justify-between items-center w-full'>
            <h1 className='text-[#aaaaaa] text-2xl'>{name}</h1>
            <h1 className='text-[#5e5e5e]'>Locked</h1>
            </div>
          </div>
    </>
  );
}
