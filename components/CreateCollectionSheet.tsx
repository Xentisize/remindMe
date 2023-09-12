import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';

import { createCollectionSchema, createCollectionSchemaType } from '@/schema/createCollection';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { CollectionColors } from '@/lib/constant';
import { SelectItem } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateCollectionSheet({ open, onOpenChange }: Props) {
  const form = useForm<createCollectionSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createCollectionSchema),
  });

  const onSubmit = (data: createCollectionSchemaType) => {
    console.log('Submitted', data);
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Collection</SheetTitle>
            <SheetDescription>Collections are a way to group your tasks</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Personal" {...field} />
                    </FormControl>
                    <FormDescription>Collection Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Color" className="w-full h-8" />
                        </SelectTrigger>
                        <SelectContent className="full-w">
                          {Object.keys(CollectionColors).map((color) => (
                            <SelectItem
                              key={color}
                              value={color}
                              className={cn(
                                `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-500 focus:ring-inset dark:focus:ring-white focus:px-8`,
                                CollectionColors[color]
                              )}
                            >
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Select a color for your collection</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CreateCollectionSheet;
