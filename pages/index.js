import Head from 'next/head';
import { useRouter } from 'next/router';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Course from '@/components/Course';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { ref } = router.query;
  const [courses, setCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
        setCoursesLoaded(true);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <Head>
        <title>S T O I C</title>
        <meta name="description" content="Track your affiliates for the stoic program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-start items-center">
        <div className="w-full md:w-[1200px]">
          <Navbar />
          <div className="p-10 flex flex-col gap-4">
            {loading || !coursesLoaded ? (
              <>
                <h1 className="text-3xl font-medium">
                  <div className="skeleton-text1"></div>
                </h1>
                {[1, 2].map((_, index) => (
                  <div key={index}>
                    <div className="skeleton-row-course"></div>
                    <div className="skeleton-row-course"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-medium">Courses</h1>
                {courses.map((course) => (
                  <Course key={course.id} course={course} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
