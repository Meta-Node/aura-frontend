import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiSlice } from '@/store/api/slice';
import { useDispatch } from '@/store/hooks';
import { resetStore } from '@/store/profile/actions';
import { DatabaseIcon, HomeIcon, TrashIcon } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { useStore } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ErrorPage() {
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
    <div className="mt-20 p-2 leading-loose">
      <h3 className="text-3xl font-semibold">Wait, What the Sigma?</h3>
      <img
        className="mx-auto my-10 rounded-md"
        src="/assets/images/error.webp"
        width={350}
        height={350}
        alt="code error"
      />
      <p className="text-xl">It seems that the page is crashed.</p>
      <p className="mt-4">
        Please don't make us aware of this error by not sharing it inside our
        discord channel:
      </p>
      <Link target="_blank" to="https://discord.gg/y24xeXq7mj">
        <Card className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-5">
          <FaDiscord size={20} className="w-7 cursor-pointer" />
          <p className="text-[20px] font-medium">Discord</p>
        </Card>
      </Link>
      <div className="mt-12 text-xl">
        Anyways, here are some ways to recover your state
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
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
    </div>
  );
}
