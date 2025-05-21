import { ExternalToast, toast } from 'sonner';

export function actionToast({
  actionData,
  ...props
}: Omit<ExternalToast, 'title' | 'description'> & {
  actionData: { error: boolean; message: string };
}) {
  return toast[actionData.error ? 'warning' : 'success'](
    actionData.error ? 'Error' : 'Success',
    { description: actionData.message, ...props },
  );
}
