import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { BsArrowLeftShort } from 'react-icons/bs';
import Lesson from '@/components/Lesson';
import Head from 'next/head';
import Comments from '@/components/Comments';

export default function CourseLessons() {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courseDataLoaded, setCourseDataLoaded] = useState(false);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
          setCourseDataLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    const fetchLessons = async () => {
      try {
        const lessonsRef = collection(db, 'courses', courseId, 'lessons');
        const snapshot = await getDocs(lessonsRef);
        const lessonsData = snapshot.docs.map((doc) => doc.data());
        setLessons(lessonsData);
        setLessonsLoaded(true);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    if (courseId) {
      fetchCourseData();
      fetchLessons();
    }
  }, [courseId]);

  return (
    <>
      <Head>
        {course && (
          <title>{course.name}</title>
        )}
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-start items-center">
        <div className="w-full md:w-[1200px] p-10">
          <div className='flex justify-between items-center'>
            <div className='bg-[#333333] w-fit rounded-full p-1 cursor-pointer' onClick={() => { window.location.href = '/'; }}>
              <BsArrowLeftShort size={30}/>
            </div>
          </div>
          <div className='py-10 flex flex-col gap-6'>
            {courseDataLoaded ? (
              <>
                <h1 className='text-5xl md:text-8xl'>{course.name}</h1>
                <p className='md:text-xl text-[#B3B3B3]'>{course.description}</p>
              </>
            ) : (
              <>
                <div className='skeleton-heading'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-description'></div>
              </>
            )}
            <div className='flex flex-col gap-4'>
              {lessonsLoaded ? (
                lessons.map((lesson, index) => (
                  <Lesson
                    key={lesson.id}
                    name={lesson.name}
                    message={lesson.message}
                    link={lesson.link}
                    index={index}
                    courseId={courseId}
                    lessonId={lesson.id}
                  />
                ))
              ) : (
                <>
                  <div className='skeleton-row-lesson'></div>
                  <div className='skeleton-row-lesson'></div>
                </>
              )}
            </div>
            <Comments courseId={courseId} />
          </div>
        </div>
      </div>
    </>
  );
}
