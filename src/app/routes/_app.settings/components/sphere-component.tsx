import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export default function SphereComponent({ className }: { className?: string }) {
  const sphereWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let sphere: any;
    let initialized = false;

    import('@/components/Shared/shaders/shpere').then(({ Sphere }) => {
      if (!sphereWrapper.current || initialized) return;
      sphereWrapper.current.innerHTML = '';

      initialized = true;
      sphere = new Sphere(sphereWrapper.current);
    });

    return () => {
      sphere?.destroy();
    };
  }, []);

  return (
    <div
      ref={sphereWrapper}
      className={cn('mx-auto h-40 w-40', className)}
    ></div>
  );
}
