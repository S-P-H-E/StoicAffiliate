import { BsArrowRightShort } from 'react-icons/bs';
import { useRouter } from 'next/router';

export default function Course({ course }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/lessons/${course.id}`); // Navigate to the lessons page with the specific course ID
  };

  return (
    <div className="bg-[#262626] px-6 py-4 rounded-3xl cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium mb-3">{course.name}</h1>
        <BsArrowRightShort size={30} />
      </div>
      <h1 className="text-[#B3B3B3]">
        {course.description}
      </h1>
    </div>
  );
}
