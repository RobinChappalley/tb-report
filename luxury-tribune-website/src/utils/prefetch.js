import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isNil } from 'ramda';

const prefetch = async (requiredJobs, jobs = []) => {
  const queryClient = new QueryClient();

  await Promise.all(
    [...requiredJobs, ...jobs].map(job => queryClient.prefetchQuery(...job))
  );

  const isValid = !requiredJobs
    .map(([jobKey]) => !isNil(queryClient.getQueryData(jobKey)))
    .includes(false);

  if (!isValid) return null;

  // Hack due to getStaticProps limitations
  // check https://github.com/vercel/next.js/discussions/11209
  return JSON.parse(JSON.stringify(dehydrate(queryClient)));
};

export default prefetch;
