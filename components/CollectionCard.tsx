'use client';

import { Collection, Task } from '@prisma/client';
import { useState, useTransition } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constant';
import { CaretDownIcon, CaretUpIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { deleteCollection } from '@/actions/collection';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import CreateTaskDialog from './CreateTaskDialog';

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

function CollectionCard({ collection }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: 'Success',
        description: 'Colletion deleted successfully',
      });
      router.refresh();
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Cannot delete collection',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={'ghost'}
            className={cn(
              'flex w-full justify-between p-6',
              CollectionColors[collection.color as CollectionColor],
              isOpen && 'rounded-b-none'
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>
            {!isOpen && <CaretDownIcon className="h-6 w-6" />}
            {isOpen && <CaretUpIcon className="h-6 w-6" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col rounded-b-md dark:bg-neutral-900 shadow-lg">
          {collection.tasks.length === 0 && (
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet:</p>
              <span
                className={cn(
                  'text-sm bg-clip-text text-transparent',
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                Create one
              </span>
            </Button>
          )}
          {collection.tasks.length > 0 && (
            <>
              <Progress className="rounded-none" value={45} />
              <div className="p-4 gap-3 flex flex-col">
                {collection.tasks.map((task) => (
                  <TaskCard />
                  <div key={task.id}>{task.content}</div>
                ))}
              </div>
            </>
          )}
          <Separator />

          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toDateString()}</p>
            {isLoading && <div>Deleting...</div>}
            {!isLoading && (
              <div>
                <Button size={'icon'} variant={'ghost'} onClick={() => setShowCreateModal(true)}>
                  <PlusIcon className="h-6 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={'icon'} variant={'ghost'}>
                      <TrashIcon className="h-6 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your collection and
                      all tasks in it.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}
                      >
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

export default CollectionCard;
