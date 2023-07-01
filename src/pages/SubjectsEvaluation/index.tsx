import { useState } from 'react';
import { SubjectCard } from './SubjectCard.tsx';
import { SubjectSearch } from './SubjectSearch.tsx';

const SubjectsEvaluation = () => {
  const [subjects] = useState<any>([
    {
      id: 1,
      image: '/assets/images/profile.jpeg',
      name: 'Sina Parvizi',
      tier: 'Bronze',
      score: '2.5k',
      status: '18 Pos / 5 Neg',
      evaluation: null,
      evaluationStrength: 'Very High',
    },
    {
      id: 2,
      image: '/assets/images/profile.jpeg',
      name: 'Sina Parvizi',
      tier: 'Bronze',
      score: '2.5k',
      status: '18 Pos / 5 Neg',
      evaluation: 'POSITIVE',
      evaluationStrength: 'Very High',
    },
    {
      id: 3,
      image: '/assets/images/profile.jpeg',
      name: 'Sina Parvizi',
      tier: 'Bronze',
      score: '2.5k',
      status: '18 Pos / 5 Neg',
      evaluation: 'NEGATIVE',
      evaluationStrength: 'Medium',
    },
  ]);

  return (
    <div className="page page__dashboard">
      <SubjectSearch />
      <p className="text-lg text-white mb-5 mt-7">
        Subjects <strong>(23)</strong>
      </p>
      <div className="flex flex-col gap-3">
        {subjects.map((subject: any) => (
          <SubjectCard subject={subject} key={subject.id} />
        ))}
      </div>
    </div>
  );
};

export default SubjectsEvaluation;
