import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiSlice } from '@/store/api/slice';
import { useDispatch } from '@/store/hooks';
import { resetStore } from '@/store/profile/actions';
import { CopyIcon, DatabaseIcon, HomeIcon, TrashIcon } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import Tooltip from './Shared/Tooltip';

export default function ErrorBoundryUi({
  isDevelopment,
  errorTitle,
  stack,
}: {
  errorTitle?: string;
  stack?: string;
  isDevelopment?: boolean;
}) {
  const [isCopiedMessage, setCopiedMessage] = useState(false);

  return (
    <>
      <div
        style={
          !isDevelopment
            ? {}
            : {
                background:
                  'linear-gradient(90deg, hsla(0,0%,25%,0.5) 1px, transparent 1px), linear-gradient(hsla(0,0%,25%,0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
              }
        }
        className={`bg-circle-dots relative bg-background-light dark:bg-background`}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        <div className="app relative">
          <div className="page flex flex-col gap-y-4 overflow-x-hidden">
            <div className="mt-20 p-2 leading-loose">
              <h3 className="text-3xl font-semibold">
                {!isDevelopment ? 'Wait What?' : 'Wait, What the Sigma?'}
              </h3>
              <img
                className="mx-auto my-10 rounded-md"
                src="/assets/images/error.webp"
                width={350}
                height={350}
                alt="code error"
              />
              <div className="flex items-center justify-between">
                <p className="text-xl">It seems that the page is crashed.</p>
                <div className="text-right">
                  <Tooltip content="Copy error message" position="left">
                    <Button
                      size="sm"
                      onClick={() => {
                        stack && navigator.clipboard.writeText(stack);

                        setCopiedMessage(true);
                        setTimeout(() => setCopiedMessage(false), 3000);
                      }}
                      disabled={isCopiedMessage}
                    >
                      {isCopiedMessage ? 'Copied!' : <CopyIcon />}
                    </Button>
                  </Tooltip>
                </div>
              </div>

              {isDevelopment || (
                <>
                  <p className="mt-4">
                    Please make us aware of this error by sharing it inside our
                    discord channel:
                  </p>
                  <Link target="_blank" to="https://discord.gg/y24xeXq7mj">
                    <Card className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-5">
                      <FaDiscord size={20} className="w-7 cursor-pointer" />

                      <p className="text-[20px] font-medium">Discord</p>
                    </Card>
                  </Link>
                </>
              )}
            </div>
            {isDevelopment ? (
              <ErrorDetails stack={stack} title={errorTitle} />
            ) : (
              <></>
            )}
          </div>

          <ErrorRestoreActions />
        </div>
      </div>
    </>
  );
}

export const ErrorDetails: FC<{ title?: string; stack?: string }> = ({
  stack,
  title,
}) => {
  return (
    <div>
      {/* <h3>{title?.toString()}</h3> */}
      <pre className="mt-2 overflow-auto text-sm leading-loose text-dark-bright">
        {stack}
      </pre>
    </div>
  );
};

export const ErrorRestoreActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const onClearCache = () => {
    localStorage.clear();
    navigate('/home');
    dispatch(apiSlice.util.resetApiState());
  };

  const onClearData = () => {
    dispatch(resetStore());
    navigate('/');
  };

  return (
    <>
      <div className="mt-2 text-xl">
        Here are some ways to recover your state
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2 md:flex-nowrap">
        <Link to="/home">
          <Button>
            <HomeIcon />
            Home
          </Button>
        </Link>
        <Button onClick={onClearCache} variant="secondary">
          <DatabaseIcon />
          Clear your cache
        </Button>
        <Button onClick={() => setShowConfirm(true)} variant="destructive">
          <TrashIcon />
          Clear your data
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogTitle>Delete data</DialogTitle>
          <DialogDescription></DialogDescription>
          <p className="text-lg">Are you sure you want to delete all data?</p>
          <DialogFooter>
            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={() => setShowConfirm(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={onClearData} variant="destructive">
                Yes, Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
