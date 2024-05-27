'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

const Page = () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const origin = searchParams.get('origin');

	const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
		onSuccess: ({ success }) => {
			if (success) {
				router.push(origin ? `/${origin}` : '/dashboard');
			}
		},
	});

	return <div>Auth Callback</div>;
};

export default Page;
