'use client';

import { Collection } from '@prisma/client';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constant';
import { useForm } from 'react-hook-form';
import { createTaskSchema, createTaskSchemaType } from '@/schema/createTask';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Textarea } from './ui/textarea';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  collection: Collection;
}

function CreateTaskDialog({ open, setOpen, collection }: Props) {
  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
  };

  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id,
    },
  });

  const onSubmit = async (data: createTaskSchemaType) => {
    console.log('SUBMITTED', data);
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Add task to collection{' '}
            <span
              className={cn(
                'p-[1px] bg-clip-text text-transparent',
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a task to your collecton. You can add as many tasks as you want to a collection.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Task content here" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
