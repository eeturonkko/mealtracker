"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "../app/_trpc/client";
import { formResetWithToast } from "@/functions/formResetWithToast";
const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});

function FoodCardForm() {
  const toast = useToast();
  const getFoodCards = trpc.getFoodCards.useQuery();

  const addFoodCard = trpc.addFoodCard.useMutation({
    onSettled: () => {
      getFoodCards.refetch();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addFoodCard.mutateAsync(values);
    formResetWithToast(
      form,
      toast,
      `FoodCard ${values.title} added`,
      "Your food card has been added successfully!"
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="title" {...field} />
              </FormControl>
              <FormDescription>
                Give your food card a title, like &quot;Week 32 meals&quot;
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Give your food card a description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full rounded" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default FoodCardForm;
