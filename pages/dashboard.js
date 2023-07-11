import Head from 'next/head';
import { useRouter } from 'next/router';
import { auth, db  } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Course from '@/components/Course';
import { collection, getDocs } from 'firebase/firestore';


export default function Dashboard({ courses }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { ref } = router.query;
  const [coursesLoaded, setCoursesLoaded] = useState(true);

  useEffect(() => {
    if (loading) {
      // Wait until the authentication state is loaded
      return;
    }

    if (!user) {
      // Redirect to login if the user is not logged in
      router.push('/login');
    }
  }, [user, loading]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
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
                  <div className="skeleton-text1 animate-pulse"/>
                </h1>
                {[1, 2].map((_, index) => (
                  <div key={index}>
                    <div className="skeleton-row-course animate-pulse"/>
                    <div className="skeleton-row-course animate-pulse"/>
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

export async function getServerSideProps() {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      props: {
        courses: coursesData,
      },
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      props: {
        courses: [],
      },
    };
  }
}
